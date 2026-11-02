const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules, codeOf } = require("./helpers");

const FILE = "ex6.js";

test("Exercise 6: the list shows 3, 2, 1, Liftoff! in this order", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.listItems, ["3", "2", "1", "Liftoff!"], `#log should show 3, 2, 1, Liftoff! (got ${JSON.stringify(result.listItems)})`);
  assert.match(codeOf(FILE), /for \(let n = 3; n >= 1; n--\)/, "keep the for loop exactly as it is: for (let n = 3; n >= 1; n--)");
  const countdown = result.lines.filter((line) => ["3", "2", "1"].includes(line.text));
  assert.ok(countdown.every((line) => line.delay === null || line.delay === 0), "the lines 3, 2 and 1 may not use a delay bigger than 0");
  assert.ok(result.lines.some((line) => line.text === "Liftoff!"), "Liftoff! should be written with addLine");
  checkRules(FILE, result);
});
