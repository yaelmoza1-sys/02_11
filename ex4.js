// ex4.js
function run() {
  console.log("1");

  setTimeout(() => {
    console.log("2");
    setTimeout(() => console.log("3"), 0);
  }, 0);

  setTimeout(() => console.log("4"), 0);

  console.log("5");
}

if (typeof module !== "undefined") module.exports = { run };
