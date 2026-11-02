// ex6.js
function run() {
  for (let n = 3; n >= 1; n--) {
    setTimeout(() => addLine(String(n)), 0);
  }
  addLine("Liftoff!");
}

if (typeof module !== "undefined") module.exports = { run };
