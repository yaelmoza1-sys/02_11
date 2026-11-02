// ex5.js
function run() {
  setTimeout(() => {
    setMessage("Ready!");
    addLine("Ready!");
  }, 10);

  setTimeout(() => {
    setMessage("Almost there...");
    addLine("Almost there...");
  }, 20);

  setMessage("Loading...");
  addLine("Loading...");
}

if (typeof module !== "undefined") module.exports = { run };
