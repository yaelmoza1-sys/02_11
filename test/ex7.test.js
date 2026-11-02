const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules, codeOf } = require("./helpers");

const FILE = "ex7.js";
const GIVEN = [
  'function loadUser(callback) { setTimeout(() => callback("Dana"), 30); }',
  "function loadOrders(callback) { setTimeout(() => callback(3), 10); }",
];

test("Exercise 7: prints User: Dana and then Orders: 3", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.logs, ["User: Dana", "Orders: 3"], `run() should print "User: Dana" and then "Orders: 3" - each one exactly once (got ${JSON.stringify(result.logs)})`);
  for (const fn of GIVEN) assert.ok(codeOf(FILE).includes(fn), `don't change loadUser and loadOrders (or their delays) - change only run: ${fn}`);
  checkRules(FILE, result);
});

test("Exercise 7: prints the values that were loaded, also when they are different", async () => {
  const result = await runExercise(FILE, (window) => {
    window.loadUser = (callback) => window.setTimeout(() => callback("Noa"), 50);
    window.loadOrders = (callback) => window.setTimeout(() => callback(7), 5);
  });
  assert.deepEqual(
    result.logs,
    ["User: Noa", "Orders: 7"],
    `when loadUser gives "Noa" (after 50 ms) and loadOrders gives 7 (after 5 ms), run() should print "User: Noa" and then "Orders: 7" - print the values the callbacks get, don't write them by hand (got ${JSON.stringify(result.logs)})`
  );
});
