// ex1.js
function run() {
  console.log("Start");
  setTimeout(() => console.log("Middle"), 0);
  console.log("End");
}

if (typeof module !== "undefined") module.exports = { run };
