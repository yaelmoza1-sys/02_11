const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules, sourceOf, codeOf } = require("./helpers");

const FILE = "ex3.js";

test("Exercise 3: prints 0, 1, 2 in this order while the loop keeps var", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.logs, ["0", "1", "2"], `run() should print 0, then 1, then 2 - each number in its own console.log (got ${JSON.stringify(result.logs)})`);
  assert.equal(result.timers.length, 3, "keep the setTimeout inside the loop - it should run 3 times");
  assert.ok(result.timers.every((timer) => timer.delay === 0), "the setTimeout must keep the delay 0");
  const prints = sourceOf(FILE).match(/console\.log\s*\(/g) ?? [];
  assert.equal(prints.length, 1, "keep a single console.log - don't write three prints by hand");
  assert.match(codeOf(FILE), /for \(var i = 0; i < 3; i\+\+\)/, "keep the loop exactly as it is: for (var i = 0; i < 3; i++)");
  assert.doesNotMatch(sourceOf(FILE), /\b(let|const)\b/, "in this exercise let and const are not allowed - solve it with a helper function");
  checkRules(FILE, result);
});
