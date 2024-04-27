// const firebaseConfig = {
//   apiKey: "AIzaSyCzNxdnZKBGObRbWt5gML4QxE-Q_vF5y_k",
//   authDomain: "zusizo-web-site.firebaseapp.com",
//   projectId: "zusizo-web-site",
//   storageBucket: "zusizo-web-site.appspot.com",
//   messagingSenderId: "68338919855",
//   appId: "1:68338919855:web:8f35ce792e8fe33547e75a",
//   measurementId: "G-TL8B0BGMG5",
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// 몸통

const catBody = document.querySelector(".cat-body");
const catHand = document.querySelector(".cat-hand");
let catAngryCount = 0;
let currTime;
const increaseWakeUpTime = () => {
  db.collection("cat")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        currTime = doc.data()["time"];
        console.log(currTime);
        db.collection("cat")
          .doc("wakeUpTime")
          .update({ time: Number(currTime) + 1 });
      });
    });
};

const catMove = () => {
  if (catAngryCount < 9) {
    catBody.style.top = `${catAngryCount * 40}px`;
    catAngryCount++;
  } else {
    increaseWakeUpTime();
    catHand.classList.add("cursor-lock");
    catBody.style.animationName = "angrycat";
    setTimeout(() => {
      catHand.classList.remove("cursor-lock");
      catBody.style.animationName = "";
      catAngryCount = 0;
      catMove();
    }, 4000);
  }
};

const catAnimationStart = () => {
  catHand.classList.add("cursor-lock");
  catHand.classList.remove("pose-grab");
  catHand.classList.add("pose-spread");
};

const catAnimationEnd = () => {
  catHand.classList.remove("pose-spread");
  catHand.classList.add("pose-grab");
  catHand.classList.remove("cursor-lock");
};

const getHandPos = () => {
  if (catHand.style.left === "") {
    return "0%";
  } else {
    return catHand.style.left;
  }
};

const getNewPos = () => {
  return 10 + Math.floor(Math.random() * 80);
};

const getDiff = (curr, next) => {
  const currPos = Number(curr.split("%")[0]);
  const nextPos = Number(next);
  return Math.abs(currPos - nextPos);
};

const setPos = (pos) => {
  catHand.style.left = `${pos}%`;
};

const setTransition = (className, timeout, nextPos) => {
  catHand.classList.toggle(className);
  setPos(nextPos);
  setTimeout(() => {
    catHand.classList.toggle(className);
    catAnimationEnd();
    catMove();
  }, timeout);
};

catHand.addEventListener("click", () => {
  catAnimationStart();

  const currPos = getHandPos();
  const nextPos = getNewPos();
  const diff = getDiff(currPos, nextPos);

  if (diff < 10) {
    setTransition("short-term", 500, nextPos);
  } else if (10 <= diff && diff < 30) {
    setTransition("middle-term", 1000, nextPos);
  } else {
    setTransition("long-term", 1500, nextPos);
  }
});

setPos(getNewPos());
