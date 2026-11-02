const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules, sourceOf } = require("./helpers");

const FILE = "ex2.js";

test("Exercise 2: prints first, second, third in this order, with three equal delays", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.logs, ["first", "second", "third"], `run() should print first, second, third - each one exactly once (got ${JSON.stringify(result.logs)})`);
  assert.equal(result.timers.length, 3, "keep the three setTimeout lines - change only their delays");
  const code = sourceOf(FILE);
  const order = ["first", "second", "third"].map((word) => code.indexOf(`"${word}"`));
  assert.ok(order[0] < order[1] && order[1] < order[2], "don't change the order of the three setTimeout lines - change only the delays");
  const delays = result.timers.map((timer) => timer.delay);
  assert.ok(delays.every((delay) => delay === delays[0]), `all three delays must be the same number (got ${delays.join(", ")})`);
  checkRules(FILE, result);
});
