// ex8.js
function run() {
  const steps = ["Step 1", "Step 2", "Step 3"];

  for (var i = 0; i < steps.length; i++) {
    setTimeout(() => {
      setMessage(steps[i]);
      addLine(steps[i]);
    }, 10);
  }

  setMessage("Done!");
  addLine("Done!");
}

if (typeof module !== "undefined") module.exports = { run };
