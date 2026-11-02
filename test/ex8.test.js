const { test } = require("node:test");
const assert = require("node:assert/strict");
const { runExercise, checkRules, codeOf } = require("./helpers");

const FILE = "ex8.js";

test("Exercise 8: the list shows Step 1, Step 2, Step 3, Done! - one step every 10 ms", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.listItems, ["Step 1", "Step 2", "Step 3", "Done!"], `#log should show Step 1, Step 2, Step 3, Done! (got ${JSON.stringify(result.listItems)})`);
  const delays = result.lines.filter((line) => line.text.startsWith("Step")).map((line) => line.delay);
  assert.deepEqual(delays, [10, 20, 30], `Step 1 should appear after 10 ms, Step 2 after 20 ms and Step 3 after 30 ms (got the delays ${delays.join(", ")})`);
  assert.match(codeOf(FILE), /for \((var|let) i = 0; i < steps\.length; i\+\+\)/, "keep the for loop over steps (you may change var to let)");
  checkRules(FILE, result);
});

test("Exercise 8: #message follows the steps and ends as Done!", async () => {
  const result = await runExercise(FILE);
  assert.deepEqual(result.messages, ["Step 1", "Step 2", "Step 3", "Done!"], `#message should show Step 1, Step 2, Step 3 and then Done! (got ${JSON.stringify(result.messages)})`);
  assert.equal(result.message, "Done!", `in the end #message should be "Done!" (got "${result.message}")`);
});
