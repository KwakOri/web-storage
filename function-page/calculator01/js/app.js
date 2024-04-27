const prevNumDisplay = document.querySelector(".prev");
const currNumDisplay = document.querySelector(".curr");
const functionDisplay = document.querySelector(".function");

let prevNum = "0";
let currNum = "";
let calcFunc = "";
let enter = false;

function drawDisplay() {
  prevNumDisplay.innerText = prevNum;
  functionDisplay.innerText = calcFunc;
  currNumDisplay.innerText = currNum;
}

function initialize() {
  prevNum = "0";
  currNum = "";
  calcFunc = "";
  enter = false;
}

function calculate() {
  switch (calcFunc) {
    case "/":
      prevNum = Number(prevNum) / Number(currNum);
      break;
    case "*":
      prevNum = Number(prevNum) * Number(currNum);
      break;
    case "+":
      prevNum = Number(prevNum) + Number(currNum);
      break;
    case "-":
      prevNum = Number(prevNum) - Number(currNum);
      break;
    case "AC":
      initialize();
      return 0;
    case "%":
      prevNum = Number(prevNum) / 100;
      break;
  }
  currNum = "";
  calcFunc = "";
  enter = true;
}

function isNum(char) {
  if ((Number(char) >= 0 && Number(char) < 10) || char === ".") {
    return true;
  }
  return false;
}

function inputKey(key) {
  if (key === "AC") {
    initialize();
    return 0;
  }
  if (key === "%") {
    prevNum = prevNum / 100;
    currNum = "";
    calcFunc = "";
    drawDisplay();
    return 0;
  }

  if (key === "=") {
    if(calcFunc !== "" && currNum !== "") {
      calculate();
      return 0;
    } else {
      return 0;
    }
  }

  if (key === ".") {
    if(prevNum === "0") {
      initialize();
      return 0;
    }
    if(calcFunc !== "" && currNum === "") {
      return 0;
    }
  }

  if (enter === true) {
    if (isNum(key) === true) {
      initialize();
      prevNum = key;
    } else {
      enter = false;
      calcFunc = key;
    }
  } else {
    if (isNum(key) === true) {
      if (calcFunc === "") {
        if (prevNum === "0") {
          prevNum = "";
        }
        prevNum += key;
        console.log(
          "prevNum:",
          prevNum,
          "calcFunc:",
          calcFunc,
          "currNum:",
          currNum
        );
      } else {
        currNum += key;
        console.log(
          "prevNum:",
          prevNum,
          "calcFunc:",
          calcFunc,
          "currNum:",
          currNum
        );
      }
    } else {
      if (calcFunc === "") {
        calcFunc = key;
        console.log(
          "prevNum:",
          prevNum,
          "calcFunc:",
          calcFunc,
          "currNum:",
          currNum
        );
      } else {
        if (currNum === "") {
          calcFunc = key;
        } else {
          calculate();
          console.log("calculation finished");
        }
      }
    }
  }
}

const btns = document.querySelectorAll("li");

btns.forEach((btn) => {
  const check = btn.innerText;
  if (check === "(" || check === ")") {
    btn.addEventListener("click", (e) => {
      alert("this button doesn't work yet!");
    });
  } else {
    btn.addEventListener("click", (e) => {
      let text = btn.textContent.trim();
      inputKey(text);
      drawDisplay();
    });
  }
});
