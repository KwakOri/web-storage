const inputBox = document.querySelector(".inputBox");
const input = document.querySelector(".inputBox input");
const btn = document.querySelector(".inputBox button");

let num;

function WriteText(num) {
  let message ="";
  if (num - 14 > 0) {
    message += (num - 14) + ", ";
  }
  if (num - 7 > 0) {
    message += (num - 7) + ", ";
  }
  if (num - 1 > 0) {
    message += (num - 1) + ", ";
  }
  message += num;

  message = "The chapters are " + message;

  return message;
}

btn.addEventListener("click",() => {
  num = input.value;
  if (num < 1 || num > 66) {
    alert("1에서 66사이의 숫자를 입력해주세요.");
  } else {  
  let result = document.createElement("h2");
  let text = document.createTextNode(WriteText(num));
  result.appendChild(text);
  document.body.appendChild(result);
  inputBox.style.display = "none";
  }
})

