 
const display = document.getElementById("display");
const expressionDisplay = document.getElementById("expression");
const historyList = document.getElementById("historyList");

let expression = "";
let justCalculated = false;


/* =========================
   APPEND VALUE
========================= */

function append(value) {

  // Start a new calculation after pressing =
  if (justCalculated && !"+-*/%".includes(value)) {
    expression = "";
    expressionDisplay.innerText = "";
    justCalculated = false;
  }

  // Prevent multiple decimal points
  if (value === ".") {

    const currentNumber = expression.split(/[+\-*/%]/).pop();

    if (currentNumber.includes(".")) {
      return;
    }
  }


  // Prevent two operators together
  if ("+-*/%".includes(value)) {

    if (expression === "") {
      return;
    }

    const lastCharacter = expression.slice(-1);

    if ("+-*/%".includes(lastCharacter)) {
      expression = expression.slice(0, -1);
    }
  }


  expression += value;

  updateDisplay();
}


/* =========================
   UPDATE DISPLAY
========================= */

function updateDisplay() {

  if (expression === "") {
    display.innerText = "0";
    return;
  }

  display.innerText = expression
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
}


/* =========================
   CLEAR
========================= */

function clearDisplay() {

  expression = "";

  display.innerText = "0";

  expressionDisplay.innerText = "";

  justCalculated = false;
}


/* =========================
   DELETE
========================= */

function deleteLast() {

  if (justCalculated) {
    clearDisplay();
    return;
  }

  expression = expression.slice(0, -1);

  updateDisplay();
}


/* =========================
   CALCULATE
========================= */

function calculate() {

  if (!expression) {
    return;
  }

  try {

    let calculation = expression;

    // Basic security validation
    if (!/^[0-9+\-*/%.() ]+$/.test(calculation)) {
      throw new Error("Invalid expression");
    }


    // Don't allow expression ending with an operator
    if ("+-*/%".includes(calculation.slice(-1))) {
      return;
    }


    let result = Function(
      `"use strict"; return (${calculation})`
    )();


    if (!Number.isFinite(result)) {
      throw new Error("Invalid result");
    }


    // Round floating-point errors
    result = Number(
      parseFloat(result.toFixed(10))
    );


    const formattedExpression = calculation
      .replace(/\*/g, "×")
      .replace(/\//g, "÷")
      .replace(/-/g, "−");


    expressionDisplay.innerText =
      formattedExpression + " =";


    display.innerText = result;


    addToHistory(
      formattedExpression,
      result
    );


    expression = String(result);

    justCalculated = true;

  } catch (error) {

    display.innerText = "Error";

    expressionDisplay.innerText = "";

    expression = "";

    justCalculated = true;
  }
}


/* =========================
   HISTORY
========================= */

function addToHistory(expression, result) {

  // Remove empty message
  const emptyMessage =
    historyList.querySelector(".empty-history");

  if (emptyMessage) {
    emptyMessage.remove();
  }


  const item = document.createElement("div");

  item.className = "history-item";


  const expressionElement =
    document.createElement("div");

  expressionElement.className =
    "history-expression";

  expressionElement.innerText =
    expression;


  const resultElement =
    document.createElement("div");

  resultElement.className =
    "history-result";

  resultElement.innerText =
    result;


  item.appendChild(expressionElement);

  item.appendChild(resultElement);


  // Click history item to use result
  item.addEventListener("click", () => {

    expression = String(result);

    display.innerText = result;

    expressionDisplay.innerText = expression;

    justCalculated = true;

  });


  historyList.prepend(item);
}


/* =========================
   CLEAR HISTORY
========================= */

function clearHistory() {

  historyList.innerHTML =
    `<p class="empty-history">
      No calculations yet
    </p>`;
}


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", (event) => {

  const key = event.key;


  // Numbers
  if (/^[0-9]$/.test(key)) {

    append(key);

    return;
  }


  // Operators
  if ("+-*/%".includes(key)) {

    append(key);

    return;
  }


  // Decimal
  if (key === ".") {

    append(".");

    return;
  }


  // Enter / =
  if (key === "Enter" || key === "=") {

    event.preventDefault();

    calculate();

    return;
  }


  // Backspace
  if (key === "Backspace") {

    deleteLast();

    return;
  }


  // Escape
  if (key === "Escape") {

    clearDisplay();

    return;
  }

});
