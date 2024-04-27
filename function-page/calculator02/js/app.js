/* input function */
/* input function */

const display = document.querySelector("#curr");
let currentLine = "";
let prevCondition = "";
let autoInitialize = true;

function sendLineDisplay(line) {
  display.textContent = line;
}

const items = {
  numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  basicOperators: ["+", "-", "*", "/"],
  startBracket: ["("],
  endBracket: [")"],
  dot: ["."],
  calc: ["=", "Enter"],
  del: ["DEL", "Backspace"],
  initialize: ["AC"],
};

function isItem(item) {
  if (items["numbers"].includes(item)) {
    return "isNumber";
  } else if (items["basicOperators"].includes(item)) {
    return "isBasicOperator";
  } else if (items["startBracket"].includes(item)) {
    return "isStartBracket";
  } else if (items["endBracket"].includes(item)) {
    return "isEndBracket";
  } else if (items["dot"].includes(item)) {
    return "isDot";
  } else if (items["calc"].includes(item)) {
    return "isCalc";
  } else if (items["del"].includes(item)) {
    return "isDEL";
  } else if (items["initialize"].includes(item)) {
    return "isInitialize";
  }
}

function endBracketCondition() {
  // ) 가 ( 의 개수를 넘지 않는지 체크.
  let startBracketCount = currentLine.split("(").length - 1;
  let endBracketCount = currentLine.split(")").length - 1;
  let condition1 = startBracketCount > endBracketCount;

  // 가장 최근의 괄호 뒤에 연산자가 있는지 체크.
  let index1 = currentLine.lastIndexOf("(");
  let index2 = currentLine.lastIndexOf(")");
  if (index1 < index2) {
    index1 = index2;
  }
  let temp = currentLine.slice(index1);
  for (const operator of items["basicOperators"]) {
    if ((temp.includes(operator) && condition1) === true) {
      return true;
    }
  }
  return false;
}

function dotCondition() {
  let lastOperatorIndex = 0;
  for (const operator of items["basicOperators"]) {
    let temp = currentLine.lastIndexOf(operator);
    if (lastOperatorIndex < temp) {
      lastOperatorIndex = temp;
    }
  }
  let temp = currentLine.slice(lastOperatorIndex);
  return temp.includes(".") === false;
}

function calcCondition() {
  for (const operator of items["basicOperators"]) {
    if (currentLine.includes(operator)) {
      return true;
    }
  }
  return false;
}

function processingKey(key) {
  if (autoInitialize === true && isItem(key) === "isNumber") {
    currentLine = "";
  }
  autoInitialize = false;

  // key는 char.
  // key의 종류 파악
  let status = isItem(key);
  // currentLine의 마지막 문자열 파악.
  let lastChar;
  if (currentLine !== "") {
    lastChar = currentLine[currentLine.length - 1];
  }
  // 입력 가능 여부 결정.
  switch (status) {
    case "isNumber":
      if (isItem(lastChar) !== "isEndBracket") {
        if (isItem(lastChar) !== "isNumber" && isItem(lastChar) !== "isDot") {
          currentLine += " ";
        }
        console.log(status);
        currentLine += key;
      }
      break;
    case "isStartBracket":
      if (
        (isItem(lastChar) !== ("isNumber" && "isDot") &&
          isItem(lastChar) === "isBasicOperator") ||
        !lastChar
      ) {
        console.log(status);
        if (lastChar) {
          currentLine += " ";
        }
        currentLine += key;
      }
      break;
    case "isEndBracket":
      if (
        isItem(lastChar) !== ("isBasicOperator" && "isDot") &&
        isItem(lastChar) === "isNumber" &&
        endBracketCondition()
      ) {
        console.log(status);
        currentLine += " ";
        currentLine += key;
      }
      break;
    case "isDot":
      if (isItem(lastChar) === "isNumber" && dotCondition()) {
        console.log(status);
        currentLine += key;
      }
      break;
    case "isDEL":
      if (currentLine.length > 0) {
        if (isItem(lastChar) !== "isNumber" && isItem(lastChar) !== "isDot") {
          currentLine = currentLine.slice(0, currentLine.length - 2);
        } else if (
          isItem(lastChar) === "isNumber" &&
          currentLine[currentLine.length - 2] === " "
        ) {
          currentLine = currentLine.slice(0, currentLine.length - 2);
        } else {
          currentLine = currentLine.slice(0, currentLine.length - 1);
        }
      }
      break;
    case "isInitialize":
      currentLine = "";
      break;
    case "isBasicOperator":
      if (
        isItem(lastChar) !== "isStartBracket" &&
        (isItem(lastChar) === "isNumber" || isItem(lastChar) === "isEndBracket")
      ) {
        console.log(status);
        currentLine += " ";
        currentLine += key;
      } else if (isItem(lastChar) === "isBasicOperator") {
        currentLine = currentLine.slice(0, currentLine.length - 1);
        currentLine += " ";
        currentLine += key;
      }
      break;
    case "isCalc":
      if (
        isItem(lastChar) !== "isStartBracket" &&
        calcCondition() &&
        (isItem(lastChar) === "isNumber" || isItem(lastChar) === "isEndBracket")
      ) {
        currentLine = calculate(currentLine.split(" "));
        break;
      }
  }

  // currentLine의 마지막 문자열 파악

  // 입력 가능 여부 결정
  if (currentLine.length === 0) {
    sendLineDisplay(currentLine);
  } else {
    sendLineDisplay(currentLine + "_");
  }
}

/* calculation function */
/* calculation function */

const basicOperations = {
  "+": (a, b) => Number(a) + Number(b),
  "-": (a, b) => Number(a) - Number(b),
  "*": (a, b) => Number(a) * Number(b),
  "/": (a, b) => Number(a) / Number(b),
};

function calcLine(_arr) {
  let arr = [..._arr];
  arr = arr.filter((x) => x);
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item === "*" || item === "/") {
      const result = basicOperations[item](arr[i - 1], arr[i + 1]);
      arr.splice(i - 1, 3, result);
      i--;
    }
  }

  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item === "-" || item === "+") {
      const result = basicOperations[item](arr[i - 1], arr[i + 1]);
      arr.splice(i - 1, 3, result);
      i--;
    }
  }
  console.log("After clacLine, arr is ", arr);
  arr = arr.filter((x) => x);
  return arr[0];
}

function calcBraket(_arr) {
  let arr = [..._arr];
  arr = arr.filter((x) => x);
  let startBracket;
  let endBracket;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "(") {
      startBracket = i;
      console.log("find start bracket!", i);
    }
    if (arr[i] === ")") {
      endBracket = i;
      console.log("find end bracket!", i);
      let bracketLine = arr.slice(startBracket + 1, endBracket);
      arr.splice(
        startBracket,
        endBracket - startBracket + 1,
        calcLine(bracketLine)
      );
      i = 0;
    }
  }
  console.log("After clacBracket, arr is ", arr);
  return arr;
}

function calculate(arr) {
  let answer;
  answer = calcBraket(arr);
  answer = calcLine(answer).toFixed(3);
  let temp = answer.split(".");
  autoInitialize = true;
  console.log(answer);
  if (temp[1] === "000") {
    return temp[0];
  } else {
    if (temp[1][2] === "0" && temp[1][1] === "0") {
      answer = answer.slice(0, -2);
    } else if (temp[1][2] === "0") {
      answer = answer.slice(0, -1);
    }
    return answer;
  }
}

const btns = document.querySelectorAll("li");
const alertBtn = document.querySelector(".alert");

window.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (isItem(e.key) !== undefined) {
    let key = e.key;
    if (e.key === "Enter") {
      key = "=";
    } else if (e.key === "Backspace") {
      key = "DEL";
    }

    prevCondition = currentLine;
    processingKey(e.key);
    if (prevCondition !== currentLine) {
      alertBtn.classList.add("hidden");
    } else {
      alertBtn.classList.remove("hidden");
    }
  }
});

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    prevCondition = currentLine;
    let text = btn.textContent.trim();
    processingKey(text);
    if (prevCondition !== currentLine) {
      alertBtn.classList.add("hidden");
    } else {
      alertBtn.classList.remove("hidden");
    }
  });
});
