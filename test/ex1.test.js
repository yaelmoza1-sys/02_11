const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules } = require("./helpers");

const FILE = "ex1.js";

test("Exercise 1: prints Start, Middle, End in this order, and Middle still comes from the setTimeout", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.logs, ["Start", "Middle", "End"], `run() should print Start, Middle, End - each one exactly once (got ${JSON.stringify(result.logs)})`);
  assert.equal(result.syncLogs[0], "Start", '"Start" should be printed first, directly by run()');
  assert.ok(!result.syncLogs.includes("Middle"), "don't remove the setTimeout - \"Middle\" must still be printed inside the setTimeout callback");
  checkRules(FILE, result);
});
