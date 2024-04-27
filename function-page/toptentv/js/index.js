import {cards} from './cards.js';

const drawBtn = document.querySelector('#draw-btn');
const resetBtn = document.querySelector('#reset-btn');
const continueBtn = document.querySelector('#continue');
const newBtn = document.querySelector('#new');
const restCard = document.querySelector('#rest-cards');

let index = [];

// add id prop in card
function resetIndexes(){
  index = [];
  for (let i=0; i<cards.length; i++){
    index.push(i);
  }
}
function sortingIndexes(){
  const arr = localStorage.getItem('used').split(',');
  for(let i=0; i<arr.length; i++){
    arr[i] = Number(arr[i]);
  }
  arr.sort((a,b) => {
    if (a > b) return -1;
    if (a === b) return 0;
    if (a < b) return 1;
  })
  return arr;
}
function createEmptyBox() {
  const newDiv = document.createElement('div');
  newDiv.className = 'card'
  document.body.appendChild(newDiv);
}
function createQuizBox(card){
  const quiz = document.createElement('h2');
  quiz.className = 'quiz'
  const quizText = document.createTextNode(card.body);
  quiz.appendChild(quizText);

  const minValue = document.createElement('p');
  minValue.className = 'opt'
  const minText = document.createTextNode('1. ' + card.min);
  minValue.appendChild(minText);

  const maxValue = document.createElement('p');
  maxValue.className = 'opt'
  const maxText = document.createTextNode('10. ' + card.max);
  maxValue.appendChild(maxText);

  const valueBox = document.createElement('div');
  valueBox.className = 'opt-box'
  valueBox.append(minValue, maxValue);

  const newDiv = document.createElement('div');
  newDiv.className = 'card'
  newDiv.append(quiz, valueBox);
  
  document.body.appendChild(newDiv);
}
function getRandomNumber(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  let num = Math.floor(Math.random() * (max - min) + min);
  return num;
}
function checkNum(){
  let numIdx = getRandomNumber(0, index.length);
  let cardIdx = index[numIdx];
  index.splice(numIdx, 1);
  
  return cardIdx;
}
function updateLocal(newCard){
  if(localStorage.used !== undefined){
    const usedNumbers = localStorage.getItem('used');
    localStorage.setItem('used', `${usedNumbers},${newCard}`);
    console.log('used card: ',localStorage.used);
  } else {
    localStorage.setItem('used', newCard);
    console.log('used card: ', localStorage.used);
  }
  
}
function drawCard(){
  const cardIdx = checkNum();
  const selectedCard = cards[cardIdx];
  console.log(selectedCard);
  createQuizBox(selectedCard);
  updateLocal(cardIdx);
}
function checkRestCards(){
  if(index.length > 0){
    drawCard();
  } else {
    index = [];
    for (let i=0; i<cards.length;i++){
      index.push(i);
    }
    localStorage.clear();
    createEmptyBox();
    alert("카드를 모두 사용하셨습니다! 카드를 다시 섞을게요!");
  }
}
function removePrevCard(){
  if(document.querySelector('.card')){
    const oldCard = document.querySelector('.card');
    oldCard.remove();
  }
}

function visibleBtns(){
  drawBtn.classList.remove('hidden');
  resetBtn.classList.remove('hidden');
  restCard.classList.remove('hidden');
}
function setRestCardCheckBox(){
  restCard.innerHTML = '';
  if(index.length < 10){
    restCardNum = document.createTextNode('0'+ index.length);
    restCard.appendChild(restCardNum);
  }else{
    restCardNum = document.createTextNode(index.length);
    restCard.appendChild(restCardNum);
  }
  
}

/* base code */
resetIndexes();

let restCardNum = document.createTextNode(index.length);
restCard.appendChild(restCardNum);


/* Event Listeners */
resetBtn.addEventListener('click', () => {
  console.log('Reset log!');
  resetIndexes();
  localStorage.clear();
  removePrevCard();
  createEmptyBox();
  setRestCardCheckBox()
  alert("초기화되었어요!");
});

drawBtn.addEventListener('click',() => {
  removePrevCard();
  checkRestCards();
  setRestCardCheckBox()
});

continueBtn.addEventListener('click',() => {
  console.log('Continue Game!');
  if(localStorage.used !== undefined){
    const arr = sortingIndexes();
    arr.forEach((idx) => {
      index.splice(idx, 1);
    });
    visibleBtns();
    removePrevCard();
    checkRestCards();
    setRestCardCheckBox()
  } else {
    alert('저장된 게임이 없습니다!');
  }
  
});

newBtn.addEventListener('click', () => {
  console.log('New Game!');
  resetIndexes();
  localStorage.clear();
  visibleBtns();
  removePrevCard();
  checkRestCards();
  setRestCardCheckBox()
});





