const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules } = require("./helpers");

const FILE = "ex4.js";

test("Exercise 4: prints 1, 5, 2, 3, 4 in this order", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.logs, ["1", "5", "2", "3", "4"], `run() should print 1, 5, 2, 3, 4 - each one exactly once (got ${JSON.stringify(result.logs)})`);
  assert.deepEqual(result.syncLogs, ["1", "5"], `"1" and "5" must stay synchronous - printed directly by run(), not inside a setTimeout (got ${JSON.stringify(result.syncLogs)})`);
  const outer = result.timers.filter((timer) => timer.phase === "run");
  assert.equal(outer.length, 2, "keep the two outer setTimeout calls in run() - change only what happens inside the first callback");
  assert.ok(outer.every((timer) => timer.delay === 0), "the two outer setTimeout calls must keep the delay 0");
  checkRules(FILE, result);
});
