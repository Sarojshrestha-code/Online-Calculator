 let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

function append(value) {
  if (display.innerText === "0") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

function clearDisplay() {
  display.innerText = "0";
}

function deleteLast() {
  let text = display.innerText;
  display.innerText = text.length > 1 ? text.slice(0, -1) : "0";
}

// 🔥 Safe calculation (basic sanitization)
function calculate() {
  try {
    let expression = display.innerText
      .replace(/×/g, "*")
      .replace(/÷/g, "/");

    // allow only numbers + operators
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
      throw "Invalid";
    }

    let result = Function(`"use strict"; return (${expression})`)();

    addToHistory(expression + " = " + result);
    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
}

// 📜 History
function addToHistory(item) {
  let p = document.createElement("p");
  p.innerText = item;
  historyList.prepend(p);
}

// ⌨️ Keyboard support
document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
    append(e.key);
  } else if (e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key === "Escape") {
    clearDisplay();
  }
});