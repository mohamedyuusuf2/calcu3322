// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.btn.number');
const operationButtons = document.querySelectorAll('.btn.operation');
const equalsButton = document.querySelector('.btn.equals');
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const percentageButton = document.querySelector('[data-operation="%"]');
const themeToggle = document.getElementById('theme-toggle');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// Initialize calculator
updateDisplay();

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Save theme preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Load saved theme preference
window.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
    }
});

// Number button event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
        updateDisplay();
    });
});

// Operation button event listeners
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.getAttribute('data-operation'));
        updateDisplay();
    });
});

// Equals button event listener
equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

// Clear button event listener
clearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

// Delete button event listener
deleteButton.addEventListener('click', () => {
    deleteDigit();
    updateDisplay();
});

// Percentage button event listener
percentageButton.addEventListener('click', () => {
    calculatePercentage();
    updateDisplay();
});

// Append number to current operand
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Replace initial 0 with number (unless it's a decimal)
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
}

// Choose operation
function chooseOperation(selectedOperation) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        compute();
    }
    
    operation = selectedOperation;
    previousOperand = currentOperand;
    shouldResetScreen = true;
}

// Perform calculation
function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = formatNumber(computation);
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
}

// Calculate percentage
function calculatePercentage() {
    if (currentOperand === '0' || currentOperand === '') return;
    
    const current = parseFloat(currentOperand);
    const percentage = current / 100;
    currentOperand = formatNumber(percentage);
}

// Format number to avoid long decimals
function formatNumber(number) {
    const stringNumber = number.toString();
    
    // If it's a decimal, limit to 8 decimal places
    if (stringNumber.includes('.')) {
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        // If decimal is too long, round it
        if (decimalDigits.length > 8) {
            return number.toFixed(8);
        }
    }
    
    return stringNumber;
}

// Update the display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    
    if (operation != null) {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
}

// Clear calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
}

// Delete last digit
function deleteDigit() {
    if (currentOperand.length === 1 || shouldResetScreen) {
        currentOperand = '0';
        shouldResetScreen = false;
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Keyboard support
document.addEventListener('keydown', event => {
    // Prevent default behavior for calculator keys
    if (event.key.match(/[0-9\.\+\-\*\/%=]|Enter|Escape|Backspace/)) {
        event.preventDefault();
    }
    
    if (event.key >= '0' && event.key <= '5') {
        appendNumber(event.key);
        updateDisplay();
    } else if (event.key === '.') {
        appendNumber('.');
        updateDisplay();
    } else if (event.key === '+' || event.key === '-') {
        chooseOperation(event.key);
        updateDisplay();
    } else if (event.key === '*') {
        chooseOperation('×');
        updateDisplay();
    } else if (event.key === '/') {
        chooseOperation('÷');
        updateDisplay();
    } else if (event.key === '%') {
        calculatePercentage();
        updateDisplay();
    } else if (event.key === 'Enter' || event.key === '=') {
        compute();
        updateDisplay();
    } else if (event.key === 'Escape' || event.key === 'Delete') {
        clear();
        updateDisplay();
    } else if (event.key === 'Backspace') {
        deleteDigit();
        updateDisplay();
    }
});

// Add touch/click feedback
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('touchstart', () => {
        button.style.opacity = '0.8';
    });
    
    button.addEventListener('touchend', () => {
        button.style.opacity = '1';
    });
    
    button.addEventListener('mousedown', () => {
        button.style.opacity = '0.8';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.opacity = '1';
    });
});