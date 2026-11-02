function addLine(text) {
  const li = document.createElement("li");
  li.textContent = text;
  document.getElementById("log").appendChild(li);
}

function setMessage(text) {
  document.getElementById("message").textContent = text;
}
