const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const EXPORT_LINE = 'if (typeof module !== "undefined") module.exports = { run };';
const MAX_DELAY = 100;

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The exercise file without comments (to check rules such as "no Promise").
function sourceOf(file) {
  return read(file).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

// Loads index.html + helpers.js + one exercise file into a fake browser (jsdom), calls run()
// like typing run() in the Console, waits for every setTimeout to finish and returns what happened.
// setup(window), if given, runs after the file is loaded and before run() (e.g. to replace a given function).
async function runExercise(file, setup) {
  assert.doesNotMatch(sourceOf(file), /\bPromise\b|\basync\b|\bawait\b|queueMicrotask|\.then\s*\(/, "Promise, async/await and .then are not allowed in this assignment - use setTimeout and the order of the lines");
  const lastLine = read(file).trim().split(/\r?\n/).pop().trim();
  assert.equal(lastLine, EXPORT_LINE, `don't change the last line of ${file}: ${EXPORT_LINE}`);

  const html = read("index.html").replace(/<script[^>]*>\s*<\/script>/gi, "");
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (err) => {
    if (!/Not implemented/.test(err.message)) errors.push(err);
  });
  const { window } = new JSDOM(html, { runScripts: "outside-only", virtualConsole });
  const document = window.document;

  const logs = []; // everything printed with console.log, one string per call
  const timers = []; // every setTimeout call: { delay, phase }
  const lines = []; // every addLine call: { text, delay } (delay = of the timer that called it, null = not in a timer)
  const messages = []; // every setMessage call, in order
  let phase = "load";
  let pending = 0;
  let currentDelay = null;

  window.console.log = (...args) => logs.push(args.map(String).join(" "));

  const realSetTimeout = window.setTimeout.bind(window);
  window.setTimeout = (callback, delay, ...args) => {
    const ms = Number(delay) || 0;
    timers.push({ delay: ms, phase });
    pending++;
    return realSetTimeout(() => {
      pending--;
      const outer = currentDelay;
      currentDelay = ms;
      try {
        if (typeof callback === "function") callback(...args);
      } catch (err) {
        errors.push(err);
      } finally {
        currentDelay = outer;
      }
    }, ms);
  };

  window.eval(read("helpers.js"));
  const { addLine, setMessage } = window;
  window.addLine = (text) => {
    lines.push({ text: String(text), delay: currentDelay });
    addLine(text);
  };
  window.setMessage = (text) => {
    messages.push(String(text));
    setMessage(text);
  };

  window.module = { exports: {} };
  try {
    window.eval(read(file));
  } catch (err) {
    throw new Error(`${file} crashed while loading: ${err.message}`);
  }
  await sleep(MAX_DELAY + 50);
  const loadLogs = [...logs];
  const loadTimers = timers.length;

  const run = window.module.exports.run ?? window.run;
  assert.equal(typeof run, "function", `${file} should still have the function run and the module.exports line at the end`);

  if (setup) setup(window);
  phase = "run";
  try {
    run();
  } catch (err) {
    throw new Error(`run() threw an error: ${err.message}`);
  }
  const syncLogs = logs.slice(loadLogs.length);
  phase = "timers";

  const deadline = Date.now() + 3000;
  while (pending > 0 && Date.now() < deadline) await sleep(10);
  if (errors.length) throw new Error(`Your code threw an error: ${errors[0].detail?.message ?? errors[0].message}`);

  return {
    logs: logs.slice(loadLogs.length),
    syncLogs,
    loadLogs,
    loadTimers,
    timers,
    lines,
    messages,
    listItems: [...document.querySelectorAll("#log li")].map((li) => li.textContent.trim()),
    message: document.getElementById("message").textContent.trim(),
  };
}

// The rules from the top of the assignment that apply to every exercise.
function checkRules(file, result) {
  assert.deepEqual(result.loadLogs, [], `${file} printed something before run() was called - don't call run() inside the file, it is called from the Console`);
  assert.equal(result.loadTimers, 0, `${file} started a setTimeout before run() was called - keep the code inside run and don't call run() yourself`);
  const tooLong = result.timers.find((timer) => timer.delay > MAX_DELAY);
  assert.ok(!tooLong, `no delay may be more than ${MAX_DELAY} ms (found setTimeout with ${tooLong?.delay})`);
}

// The file's code with all whitespace squeezed to single spaces (to check that given lines were kept).
function codeOf(file) {
  return sourceOf(file).replace(/\s+/g, " ");
}

module.exports = { runExercise, checkRules, sourceOf, codeOf };
