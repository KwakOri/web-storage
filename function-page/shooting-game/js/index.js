let canvas, timeline, ctx;

const menu = document.querySelector('.menu');
const manual = document.querySelector('.manual');
const startBtn = document.querySelector('#start-btn');
const manualBtn = document.querySelector('#manual-btn');
const restartBtn = document.querySelector('#restart-btn');
const pressBtn = document.querySelector('#press-btn');
const resetBtn = document.querySelector('#reset-btn');
const prevBtn = document.querySelector('#prev-btn');
const count = document.querySelector("#count");

let backgroundImage, spaceshipImage, bulletImage, enemyImage, boomImage, gameOverImage, cometImage, sidebarImage, bossImage, skullImage, successImage, dummyImage, missileImage, torpedoImage, rocketImage, normalBulletImage;

let backgroundSrc = "./img/background.jpeg";
let successSrc = "./img/success.png";
let sidebarSrc = "./img/sidebar.png";
let skullSrc = "./img/skull.png";
let bossSrc = "./img/boss.png";
let spaceshipSrc = "./img/spaceship.png";
let bulletSrc = "./img/bullet.png";
let enemySrc = "./img/enemy.png";
let boomSrc = "./img/explode.png";
let gameOverSrc = "./img/gameover.png";
let cometSrc = "./img/comet.png";
let dummySrc = "./img/dummy.png";
let missileSrc = "./img/missile.png";
let torpedoSrc = "./img/torpedo.png";
let rocketSrc = "./img/rocket.png";
let normarBulletSrc = "./img/normal-bullet.png";


canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 700;

timeline = document.createElement('canvas');
timelineCtx = timeline.getContext('2d');
timeline.width = 100;
timeline.height = canvas.height;

let skullX = 20;
let skullY = 300;
const skullSize = 60;

const bossSize = 400;
let bossOnline = false;
let bossX = 0;
let bossY = 0;

const getEffectSize = 40;
const itemSize = 40;
const cometSize = 40;
const enemySize = 60;
const boomSize = 60;
const damageSize = 30;
const spaceshipSize = 60;
const gameOverSize = 400;
const successWidth = 420;
const successHeight = 280;

let keysDown = {};
let bulletList = [];
let enemyList = [];
let boomList = [];
let damageList = [];
let cometList = [];
let bossList = [];
let bossDamageList = [];
let getEffectList = [];
let itemList = [];
let itemNames; 


let attackMode = {
  type: 'none',
  bullet: 0,
};

let spaceshipX = (canvas.width / 2) - 30 ; 
let spaceshipY = 620;
let spaceshipAnchor = spaceshipX + (spaceshipSize / 2);
let bonusBullet = 0;

let bossDestroy = false;
let destroyDate;

let intervalList = [];
let gameOver = false;
let gameOverDate;


//time <= sec * 10

const time = 900;

function startBossRound(){
  let boss = new Boss();
  bossList.push(boss);
  bossOnline = true;
}

function increaseTimer(){
  if (skullY < 620){
    skullY += 320 / time;
  } else {
    startBossRound();
    clearInterval(intervalList[2]);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function Boss(){
  this.x = 100;
  this.y = -400;
  this.life = 200;
  this.update = () => {
    this.y += 3;
  }
}

function Item(){
  this.x = 0;
  this.Y = 0;
  this.content;
  this.num;
  this.init = (num) => {
    const posX = getRandomInt(0,canvas.width - 60);
    this.x = posX;
    this.y = -100;
    this.num = num;
    this.content = itemNames[num][0];
    itemList.push(this);
  }
  this.update = () => {
    this.y += 2;
  }
}

function createItem(){
  let item = new Item();
  item.init(getRandomInt(1, Object.keys(itemNames).length + 1));
}

function getBonusBullet(itemType){
  if (itemType === 'power up'){
    attackMode.type = 'power up';
    attackMode.bullet = 30;
  } else if(itemType === 'double shot') {
    attackMode.type = 'double shot';
    attackMode.bullet = 30;
  } else if(itemType === 'super power') {
    attackMode.type = 'super power';
    attackMode.bullet = 30;
  }
  
}

function Enemy(){
  this.x = 0;
  this.y = 0;
  this.life = 0;
  this.init = () => {
    const posX = getRandomInt(0,canvas.width - 60);
    this.x = posX;
    this.y = -100;
    this.life = 4;
    enemyList.push(this);
  }
  this.update = () => {
    this.y += 1;
  }
}

function createEnemy(){
  let enemy = new Enemy();
  enemy.init();
  if(bossOnline){
    enemy = new Enemy();
    enemy.init();
  }
}

function Bullet(){
  this.x = 0;
  this.y = 0;
  this.damage = 0;
  this.size = 0;
  this.init = (x, y, damage = 1, size = 20) => {
    this.x = x + 20;
    this.y = y;
    this.damage = damage;
    this.size = size;
    bulletList.push(this);
  }
  this.update = () => {
    this.y -= 5;
  }
}

function createBullet(){
  switch(attackMode.type){
    case 'power up':
      if(attackMode.bullet > 1){
        let bullet = new Bullet();
        bullet.init(spaceshipX, spaceshipY, 2, 40);
        attackMode.bullet -= 1;
        console.log("power up bullet:", attackMode.bullet);
      } else {
        attackMode.bullet -= 1;
        attackMode.type = 'none';
        console.log('There is no power up bullet');
      }
      break;
    case 'double shot':
      if(attackMode.bullet > 1){
        let bullet = new Bullet();
        bullet.init(spaceshipX - (spaceshipSize / 2), spaceshipY);
        bullet = new Bullet();
        bullet.init(spaceshipX + (spaceshipSize / 2), spaceshipY);
        attackMode.bullet -= 1;
        console.log("double shot bullet:", attackMode.bullet);
      } else {
        attackMode.bullet -= 1;
        attackMode.type = 'none';
        console.log('There is no double shot bullet');
      }
      break;
    case 'super power':
      if(attackMode.bullet > 1){
        let bullet = new Bullet();
        bullet.init(spaceshipX - (spaceshipSize / 2), spaceshipY, 2, 40);
        bullet = new Bullet();
        bullet.init(spaceshipX + (spaceshipSize / 2), spaceshipY, 2, 40);
        attackMode.bullet -= 1;
        console.log("double shot bullet:", attackMode.bullet);
      } else {
        attackMode.bullet -= 1;
        attackMode.type = 'none';
        console.log('There is no super power up bullet');
      }
      break;
    default:
      let bullet = new Bullet();
      bullet.init(spaceshipX, spaceshipY, 1, 20);
      console.log('Normal bullet');
      break;
  }
}

function Comet(){
  this.x = 0;
  this.y = 0;
  this.init = () => {
    const posX = getRandomInt(0,canvas.width - 60);
    this.x = posX;
    this.y = -100;
    cometList.push(this);
  }
  this.update = () => {
    this.y += 3;
  }
}

function createComet(){
  let comet = new Comet();
  comet.init();
  if(bossOnline){
    comet = new Comet();
    comet.init();
  }
}

function Boom(){
  this.x = 0;
  this.y = 0;
  this.date;
  this.init = (enemyX, enemyY) => {
    this.x = enemyX;
    this.y = enemyY;
    this.date = Date.now();
    boomList.push(this);
  }
  this.update = () => {
    this.y += 0.5;
  }
}

function GetEffect(){
  this.x = 0;
  this.y = 0;
  this.num;
  this.date;
  this.init = (posX, posY, num) => {
    this.x = posX;
    this.y = posY;
    this.num = num;
    this.date = Date.now();
    getEffectList.push(this);
  }
  this.update = () => {
    this.y -= 0.3;
  }
}

function generateGetEffect(posX, posY, num){
  let getEffect = new GetEffect();
  getEffect.init(posX, posY, num);
}

function Damage(){
  this.x = 0;
  this.y = 0;
  this.size = 20;
  this.increasement = 1;
  this.date;
  this.init = (enemyX, enemyY) => {
    this.x = enemyX + (enemySize / 2) - (this.size / 2);
    this.y = enemyY + 40 - (this.size / 2);
    this.date = Date.now();
    damageList.push(this);
  }
  this.update = () => {
    this.size += this.increasement;
    this.y += 0.75;
    this.y -= (this.increasement / 2);
    this.x -= (this.increasement / 2);
  }
}

function BossDamage(){
  this.x = 0;
  this.y = 0;
  this.date;
  this.size = 0;
  this.incresement = 0.4;
  this.init = (posX, posY, size = 20, incresement = 0.4) => {
    this.incresement = incresement;
    this.size = size;
    this.x = posX - (this.size / 2);
    this.y = posY - (this.size / 2);
    this.date = Date.now();
    bossDamageList.push(this);
  }
  this.update = () => {
    this.size += this.incresement;
    this.x -= this.incresement / 2;
    this.y -= this.incresement / 2;
  }
}

function generateBoom(enemyX, enemyY){
  let boom = new Boom();
  boom.init(enemyX, enemyY);
}

function generateDamage(enemyX, enemyY){
  let damage = new Damage();
  damage.init(enemyX, enemyY);
}

function generateBossDamage(posX, posY, size = 20, increasement = 0.4){
  let bossDamage = new BossDamage();
  bossDamage.init(posX, posY, size, increasement);
}

function destroyBoss(){
  const posX = getRandomInt(100, 500 + 1);
  const posY = getRandomInt(0, 150 + 1);
  generateBossDamage(posX, posY, 60, 1.5);
}

function destroySpaceship(){
  const posX = getRandomInt(spaceshipX, spaceshipX + spaceshipSize + 1);
  const posY = getRandomInt(spaceshipY, spaceshipY + spaceshipSize + 1);
  generateBossDamage(posX, posY, 30, 0.5);
}

function destroyRender(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 60, 60);
  bossList.forEach((boss) => {
    ctx.drawImage(bossImage, boss.x, boss.y, bossSize, bossSize);
  });
  bossDamageList.forEach((damage) => {
    ctx.drawImage(boomImage, damage.x, damage.y, damage.size, damage.size);
  });
  timelineCtx.drawImage(sidebarImage, 0, 0, timeline.width, timeline.height);
  timelineCtx.drawImage(skullImage, skullX, skullY, 60, 60)
} 

function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src = backgroundSrc;
  backgroundImage.style.objectFit = 'cover';

  successImage = new Image();
  successImage.src = successSrc;

  sidebarImage = new Image();
  sidebarImage.src = sidebarSrc;

  skullImage = new Image();
  skullImage.src = skullSrc;

  bossImage = new Image();
  bossImage.src = bossSrc;

  spaceshipImage = new Image;
  spaceshipImage.src = spaceshipSrc;

  bulletImage = new Image();
  bulletImage.src = bulletSrc;

  enemyImage = new Image();
  enemyImage.src = enemySrc;

  boomImage = new Image();
  boomImage.src = boomSrc

  gameOverImage = new Image();
  gameOverImage.src = gameOverSrc;

  cometImage = new Image();
  cometImage.src = cometSrc;

  dummyImage = new Image();
  dummyImage.src = dummySrc;

  missileImage = new Image();
  missileImage.src = missileSrc;

  torpedoImage = new Image();
  torpedoImage.src = torpedoSrc;

  rocketImage = new Image();
  rocketImage.src = rocketSrc;

  normalBulletImage = new Image();
  normalBulletImage.src = normarBulletSrc;

  itemNames = {
    1: ['power up', torpedoImage],
    2: ['double shot', missileImage],
    3: ['super power', rocketImage],
  }
}


function setupKeyboardListener(){
  document.addEventListener('keydown', (e) => {
    keysDown[e.code] = true;
  
  });
  document.addEventListener('keyup', (e) => {
    delete keysDown[e.code];
    
    if(e.code === 'Space'){
      createBullet();
    }
  });
}



function update(){
  if ('ArrowRight' in keysDown && spaceshipX < canvas.width - 60){
    spaceshipX += 5;
  } else if('ArrowLeft' in keysDown && spaceshipX > 0) {
    spaceshipX -= 5;
  } else if('ArrowUp' in keysDown && spaceshipY > 400) {
    spaceshipY -= 4;
  } else if('ArrowDown' in keysDown && spaceshipY < 620) {
    spaceshipY += 4;
  }
  spaceshipAnchor = spaceshipX + (spaceshipSize / 2);

  for(let i=0; i<bulletList.length; i++){
    bulletList[i].update();
    if(bulletList[i].y < 0) {
      bulletList.splice(i, 1);
      i--;
    }
  }
  
  for(let i=0; i<enemyList.length; i++){
    enemyList[i].update();
    const enemyPosX = enemyList[i].x;
    const enemyPosY = enemyList[i].y;
    if(enemyPosY > 650) {
      stopGame();
    };
    for(let j=0; j<bulletList.length; j++){
      const bulletX = bulletList[j].x + 10;
      const bulletY = bulletList[j].y;
      if(((enemyPosX < bulletX) && (bulletX < enemyPosX + 60)) && ((enemyPosY < bulletY) && (bulletY < enemyPosY + 30))){
        enemyList[i].life -= bulletList[j].damage;
        if(enemyList[i].life > 0){
          generateDamage(enemyPosX, enemyPosY);
          bulletList.splice(j, 1);
          j--;
        } else {
          generateBoom(enemyPosX, enemyPosY);
          enemyList.splice(i, 1);
          console.log("The enemy is destroyed");
          bulletList.splice(j, 1);
          i--;
          j--;
        }
      }
    } 
  }
  for(let i=0; i<itemList.length; i++){
    const item = itemList[i];
    item.update();
    const hrzBool = (spaceshipAnchor < item.x + itemSize) && (item.x < spaceshipAnchor);
    const vtcBool = (spaceshipY + 10  < item.y + itemSize);
    const vtcEndBool = (item.y > canvas.height);
    if(hrzBool && vtcBool){
      getBonusBullet(item.content);
      generateGetEffect(item.x, item.y, item.num);
      itemList.splice(i, 1);
      i--;
    }
  }
  for(let i=0; i<getEffectList.length; i++){
    const effect = getEffectList[i];
    if(effect.date + 1000 < Date.now()){
      getEffectList.splice(i, 1);
      i--;
    } else {
      effect.update();
    }
  }
  // enemy 폭발 효과
  for(let i=0; i<boomList.length; i++){
    boomList[i].update();
    if(boomList[i].date + 500 < Date.now()){
      boomList.splice(i, 1);
      i--;
    }
  }
  // 타격 효과 움직임
  for(let i=0; i<damageList.length; i++){
    damageList[i].update();
    if(damageList[i].date + 500 < Date.now()){
      damageList.splice(i, 1);
      i--;
    }
  }
  for(let i=0; i<bossDamageList.length; i++){
    bossDamageList[i].update();
    if(bossDamageList[i].date + 500 < Date.now()){
      bossDamageList.splice(i, 1);
      i--;
    }
  }
  for(let i=0; i<cometList.length; i++){
    cometList[i].update();
    const cometAnchor = cometList[i].x + (cometSize / 2) ;
    const cometHead = cometList[i].y + cometSize ;
    const hrzBool = (spaceshipAnchor - 20 < cometAnchor) && (cometAnchor < spaceshipAnchor + 20);
    const vtcBool = (spaceshipY + 10  < cometHead) && (cometHead < spaceshipY + spaceshipSize);
    const vtcEndBool = (cometList[i].y > canvas.height);
    if(hrzBool && vtcBool){
      stopGame();
    } else if(vtcEndBool){
      cometList.splice(i, 1);
      i--;
    }
  }
  for(let i=0; i<bossList.length; i++){
    const bossX = bossList[i].x + 200;
    const bossY = bossList[i].y;
    if(bossY < -200){
      bossList[i].update();
    }
    for(let j=0; j<bulletList.length; j++){
      const bulletX = bulletList[j].x + 10;
      const bulletY = bulletList[j].y;
      const hrzBool = (bossX - 200 < bulletX) && (bulletX < bossX + 200);
      const vtcBool = bulletY < bossY + 300;
      if(hrzBool && vtcBool){
        if(bossList[0]){
          if(bossList[i].life > 0){
            bossList[i].life -= bulletList[j].damage;
            generateBossDamage(bulletX, bulletY, 40, 1);
            bulletList.splice(j, 1);
            j--;
          } else {
            endGame();
            bossDestroy = true;
          }
        }
      }
    }
  }
}

function showRestBullet(){
  if(attackMode.bullet < 10){
    return '0' + String(attackMode.bullet);
  } else {
    return String(attackMode.bullet);
  }
}

function render() {
  let itemPreview;

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  
  bulletList.forEach((bullet) => {
    ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.size, bullet.size);
  });
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 60, 60);

  enemyList.forEach((enemy) => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemySize, enemySize);
  });
  boomList.forEach((boom) => {
    ctx.drawImage(boomImage, boom.x, boom.y, boomSize, boomSize);
  });
  damageList.forEach((damage) => {
    ctx.drawImage(boomImage, damage.x, damage.y, damage.size, damage.size);
  });
  cometList.forEach((comet) => {
    ctx.drawImage(cometImage, comet.x, comet.y, cometSize, cometSize);
  });
  itemList.forEach((item) => {
    ctx.drawImage(dummyImage, item.x, item.y, itemSize, itemSize);
  });
  getEffectList.forEach((effect) => {
    let imageSrc = itemNames[effect.num]; 
    ctx.drawImage(imageSrc[1], effect.x, effect.y, getEffectSize, getEffectSize)
  });

  bossList.forEach((boss) => {
    ctx.drawImage(bossImage, boss.x, boss.y, bossSize, bossSize);
  });
  bossDamageList.forEach((damage) => {
    ctx.drawImage(boomImage, damage.x, damage.y, damage.size, damage.size);
  }); 

  timelineCtx.drawImage(sidebarImage, 0, 0, timeline.width, timeline.height);
  timelineCtx.drawImage(skullImage, skullX, skullY, 60, 60);
  switch(attackMode.type){
    case 'double shot':
      timelineCtx.drawImage(missileImage, 20, 20, 60, 60);
      break;
    case 'power up':
      timelineCtx.drawImage(torpedoImage, 20, 20, 60, 60);
      break;
    case 'super power':
      timelineCtx.drawImage(rocketImage, 20, 20, 60, 60);
      break;
    default:
      timelineCtx.drawImage(normalBulletImage, 20, 20, 60, 60);
      break;
  }
  timelineCtx.font = '40px Galmuri7';
  timelineCtx.fillText(showRestBullet(), 28, 140);
}

// Enemy 생성 주기
function startGame(){
  const enemyInterval = setInterval(createEnemy, 2000);
  const cometInterval = setInterval(createComet, 1500);
  const timerInterval = setInterval(increaseTimer, 100);
  const itemInterval = setInterval(createItem, 15000);
  intervalList.push(enemyInterval);
  intervalList.push(cometInterval);
  intervalList.push(timerInterval);
  intervalList.push(itemInterval);
}

function stopGame(){
  intervalList.forEach((interval) => {
    clearInterval(interval);
  });
  enemyList.splice(0,enemyList.length);
  cometList.splice(0,cometList.length);
  gameOver = true;
}

function endGame(){
  intervalList.forEach((interval) => {
    clearInterval(interval);
  });
  enemyList.splice(0,enemyList.length);
  cometList.splice(0,cometList.length);
  bulletList.splice(0, bulletList.length);
}

function showEndScreen(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(gameOverImage, (canvas.width - gameOverSize) / 2, (canvas.height - gameOverSize) / 4, gameOverSize, gameOverSize);
  restartBtn.classList.remove('hidden');
}

function showSuccessScreen(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(successImage, (canvas.width - successWidth) / 2, (canvas.height - successHeight) / 4, successWidth, successHeight);
  restartBtn.classList.remove('hidden');
}

function hideBtns() {
  menu.classList.add('hidden');
}

function showManual() {
  manual.classList.remove('hidden');
}

function hideManual() {
  manual.classList.add('hidden');
}

function endEffect() {
  if(Date.now() < destroyDate + 5000){
    update();
    destroyRender();
    requestAnimationFrame(endEffect);
  } else {
    return 0;
  }
}

function gameOverEffect() {
  if(Date.now() < gameOverDate + 3000){
    update();
    destroyRender();
    requestAnimationFrame(gameOverEffect);
  } else {
    return 0;
  }
}


function main() {
  update();
  render();
  if(gameOver === true){
    if(bossList[0]){
      bossList[0].life = 100;
    }
    const shipDestroyInterval = setInterval(() => {
      destroySpaceship();
    }, 100);
    gameOverDate = Date.now();
    gameOverEffect();
    setTimeout(() => {
      clearInterval(shipDestroyInterval);
      showEndScreen();
    }, 3000);
  } else if(bossDestroy === true){
    const bossDestroyInterval = setInterval(() => {
      destroyBoss();
    }, 100);
    destroyDate = Date.now();
    endEffect();
    setTimeout(() => {
      clearInterval(bossDestroyInterval);
      showSuccessScreen();
    }, 5000);
  } else {
    requestAnimationFrame(main);
  }
  
}
loadImage();

restartBtn.addEventListener('click', () => {
  location.reload();
});

manualBtn.addEventListener('click', () => {
  showManual();
});

prevBtn.addEventListener('click', () => {
  hideManual();
});

pressBtn.addEventListener("click", () => {
  count.innerHTML = Number(count.innerHTML) + 1;
});

resetBtn.addEventListener("click", () => {
  count.innerHTML = 0;
});

startBtn.addEventListener('click', () => {
  hideBtns();
  document.body.appendChild(timeline);
  document.body.appendChild(canvas);
  setupKeyboardListener();
  startGame();
  main();
});


