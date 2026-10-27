// =========================
// DISPLAY
// =========================

const previousValue = document.querySelector(".previous-value");
const currentValue = document.querySelector(".current-value");


// =========================
// BUTTONS
// =========================

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const functionButtons = document.querySelectorAll(".function");
const equalsButton = document.querySelector(".equals");


// =========================
// CALCULATOR STATE
// =========================

let currentNumber = "";
let previousNumber = "";
let selectedOperator = null;
let shouldResetScreen = false;


// =========================
// UPDATE DISPLAY
// =========================

function updateDisplay() {

    currentValue.textContent =
        currentNumber === ""
            ? "0"
            : currentNumber;

    previousValue.textContent =
        previousNumber && selectedOperator
            ? `${previousNumber} ${selectedOperator}`
            : "";
}


// =========================
// NUMBER INPUT
// =========================

numberButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const number = button.textContent;

        if (currentNumber === "Error") {
            currentNumber = "";
        }

        if (shouldResetScreen) {
            currentNumber = "";
            shouldResetScreen = false;
        }

        if (number === "." && currentNumber.includes(".")) {
            return;
        }

        if (currentNumber === "" && number === ".") {
            currentNumber = "0.";
        } else {
            currentNumber += number;
        }

        updateDisplay();

    });

});


// =========================
// OPERATOR INPUT
// =========================

operatorButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (currentNumber === "" || currentNumber === "Error") {
            return;
        }

        if (previousNumber !== "" && selectedOperator) {
            calculate();
        }

        previousNumber = currentNumber;
        selectedOperator = button.dataset.operator;

        shouldResetScreen = true;

        updateDisplay();

    });

});


// =========================
// CALCULATE
// =========================

function calculate() {

    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
        return;
    }

    let result;

    switch (selectedOperator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {
                currentNumber = "Error";
                previousNumber = "";
                selectedOperator = null;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    result = Number(result.toFixed(10));

    currentNumber = String(result);

    previousNumber = "";
    selectedOperator = null;

    shouldResetScreen = true;

    updateDisplay();

}


// =========================
// EQUALS
// =========================

if (equalsButton) {

    equalsButton.addEventListener("click", function() {

        if (
            previousNumber === "" ||
            selectedOperator === null ||
            currentNumber === ""
        ) {
            return;
        }

        const expression =
            `${previousNumber} ${selectedOperator} ${currentNumber}`;

        calculate();

        addToHistory(expression, currentNumber);

    });

}


// =========================
// FUNCTION BUTTONS
// =========================

functionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const action = button.dataset.action;

        // AC
        if (action === "clear") {

            currentNumber = "";
            previousNumber = "";
            selectedOperator = null;
            shouldResetScreen = false;

            updateDisplay();

        }


        // +/- 
        if (action === "plus-minus") {

            if (currentNumber === "" || currentNumber === "0") {
                return;
            }

            currentNumber =
                String(parseFloat(currentNumber) * -1);

            updateDisplay();

        }


        // %
        if (action === "percent") {

            if (currentNumber === "") {
                return;
            }

            currentNumber =
                String(parseFloat(currentNumber) / 100);

            updateDisplay();

        }

    });

});


// =========================
// SCIENTIFIC MODE
// =========================

const scientificButtons =
    document.querySelector(".scientific-buttons");

const basicModeButton =
    document.querySelector('[data-mode="basic"]');

const scientificModeButton =
    document.querySelector('[data-mode="scientific"]');


if (basicModeButton && scientificModeButton) {

    scientificModeButton.addEventListener("click", function() {

        scientificButtons.classList.add("show");

        scientificModeButton.classList.add("active");
        basicModeButton.classList.remove("active");

    });


    basicModeButton.addEventListener("click", function() {

        scientificButtons.classList.remove("show");

        basicModeButton.classList.add("active");
        scientificModeButton.classList.remove("active");

    });

}


// =========================
// SCIENTIFIC FUNCTIONS
// =========================

const scientificFunctionButtons =
    document.querySelectorAll(".scientific-buttons .button");


scientificFunctionButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (currentNumber === "") {
            return;
        }

        const action = button.dataset.action;
        const number = parseFloat(currentNumber);

        let result;

        switch (action) {

            case "sin":
                result = Math.sin(number * Math.PI / 180);
                break;

            case "cos":
                result = Math.cos(number * Math.PI / 180);
                break;

            case "tan":
                result = Math.tan(number * Math.PI / 180);
                break;

            case "sqrt":
                result = Math.sqrt(number);
                break;

            case "square":
                result = number ** 2;
                break;

            case "reciprocal":

                if (number === 0) {
                    currentNumber = "Error";
                    updateDisplay();
                    return;
                }

                result = 1 / number;
                break;

            case "pi":
                result = Math.PI;
                break;

            case "log":
                result = Math.log10(number);
                break;

            default:
                return;
        }

        currentNumber =
            String(Number(result.toFixed(10)));

        shouldResetScreen = true;

        updateDisplay();

    });

});


// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle =
    document.querySelector(".theme-toggle");


if (themeToggle) {

    themeToggle.addEventListener("click", function() {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "☀️";
        } else {
            themeToggle.textContent = "🌙";
        }

    });

}


// =========================
// HISTORY
// =========================

const historyToggle =
    document.querySelector(".history-toggle");

const historyPanel =
    document.querySelector(".history-panel");

const historyList =
    document.querySelector(".history-list");

const clearHistoryButton =
    document.querySelector(".clear-history");


let calculationHistory = [];


// =========================
// OPEN / CLOSE HISTORY
// =========================

if (historyToggle) {

    historyToggle.addEventListener("click", function() {

        historyPanel.classList.toggle("show");

    });

}


// =========================
// ADD HISTORY
// =========================

function addToHistory(expression, result) {

    calculationHistory.unshift({
        expression: expression,
        result: result
    });

    renderHistory();

}


// =========================
// RENDER HISTORY
// =========================

function renderHistory() {

    if (!historyList) {
        return;
    }

    historyList.innerHTML = "";

    if (calculationHistory.length === 0) {

        historyList.innerHTML =
            `<p class="empty-history">No calculations yet.</p>`;

        return;
    }


    calculationHistory.forEach(function(item) {

        const historyItem =
            document.createElement("div");

        historyItem.classList.add("history-item");

        historyItem.innerHTML = `
            <div class="history-expression">
                ${item.expression} =
            </div>

            <div class="history-result">
                ${item.result}
            </div>
        `;


        historyItem.addEventListener("click", function() {

            currentNumber = String(item.result);

            shouldResetScreen = true;

            updateDisplay();

            historyPanel.classList.remove("show");

        });


        historyList.appendChild(historyItem);

    });

}


// =========================
// CLEAR HISTORY
// =========================

if (clearHistoryButton) {

    clearHistoryButton.addEventListener("click", function() {

        calculationHistory = [];

        renderHistory();

    });

}


// =========================
// INITIAL DISPLAY
// =========================

updateDisplay();

renderHistory();


// =========================
// KEYBOARD SUPPORT
// =========================

document.addEventListener("keydown", function(event) {

    const key = event.key;


    // Numbers
    if (/^[0-9]$/.test(key)) {

        const button =
            document.querySelector(
                `.number[data-number="${key}"]`
            );

        if (button) {
            button.click();
        }

    }


    // Decimal
    if (key === ".") {

        const button =
            document.querySelector(
                '.number[data-number="."]'
            );

        if (button) {
            button.click();
        }

    }


    // Operators
    const operatorMap = {
        "+": "+",
        "-": "-",
        "*": "×",
        "/": "÷"
    };


    if (operatorMap[key]) {

        const button =
            document.querySelector(
                `.operator[data-operator="${operatorMap[key]}"]`
            );

        if (button) {
            button.click();
        }

    }


    // Enter
    if (key === "Enter" || key === "=") {

        if (equalsButton) {
            equalsButton.click();
        }

    }


    // Escape = clear
    if (key === "Escape") {

        const clearButton =
            document.querySelector(
                '[data-action="clear"]'
            );

        if (clearButton) {
            clearButton.click();
        }

    }

});