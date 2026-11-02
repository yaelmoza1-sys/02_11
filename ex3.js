// ex3.js
function run() {
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }
}

if (typeof module !== "undefined") module.exports = { run };
