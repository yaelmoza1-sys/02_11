// ex2.js
function run() {
  setTimeout(() => console.log("first"), 30);
  setTimeout(() => console.log("second"), 20);
  setTimeout(() => console.log("third"), 10);
}

if (typeof module !== "undefined") module.exports = { run };
