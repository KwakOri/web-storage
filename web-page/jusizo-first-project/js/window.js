const blinds = document.querySelectorAll(".window-blind");
const blindStep = ["14px", "64px", "114px", "164px", "214px"]
;
const windowBox = document.querySelector(".window-box");
const standardTimeInterval = 125;

const windowAnimationStart = () => {
  windowBox.classList.add("cursor-lock");
  terus.forEach((teru) => {
    teru.classList.add("cursor-lock");
  });
};

const windowAnimationEnd = () => {
  windowBox.classList.remove("cursor-lock");
  terus.forEach((teru) => {
    teru.classList.remove("cursor-lock");
  });
};

const closeBlinds = () => {
  for (let index = 1; index < 5; index++) {
    setTimeout(() => {
      for (let i = index; i < 5; i++) {
        blinds[i].style.top = blindStep[index];
      }
    }, standardTimeInterval * index);
  }
};

const openBlinds = () => {
  for (let index = 3; index >= 0; index--) {
    setTimeout(() => {
      for (let i = 4; i > index; i--) {
        blinds[i].style.top = blindStep[index];
      }
    }, standardTimeInterval * (4 - index));
  }
};

windowBox.addEventListener("click", (e) => {
  windowBox.classList.toggle("closed");
  if (windowBox.classList.contains("closed")) {
    windowAnimationStart();
    closeBlinds();
    setTimeout(() => {
      windowAnimationEnd();
    }, 1000);
  } else {
    windowAnimationStart();
    openBlinds();
    setTimeout(() => {
      windowAnimationEnd();
    }, 1000);
  }
});

const windowFrame = document.querySelector(".window-frame");
const sunnySrc = "./img/gif/sunny40.gif";
const rainySrc = "./img/gif/rainy05.gif";
const snowSrc = "./img/gif/snow20.gif";
const cloudySrc = "./img/gif/cloudy20.gif";

const weathers = [sunnySrc, rainySrc, snowSrc, cloudySrc];

const setBackgroungImage = (dom, src) => {
  dom.style.backgroundImage = `url(${src})`;
};

const setWeather = (weather) => {
  switch (weather) {
    case "Clear":
      setBackgroungImage(windowFrame, sunnySrc);
      break;
    case "Clouds":
      setBackgroungImage(windowFrame, cloudySrc);
      break;
    case "Drizzle":
    case "Rain":
    case "Thunderstorm":
      setBackgroungImage(windowFrame, rainySrc);
      break;
    case "Snow":
      setBackgroungImage(windowFrame, snowSrc);
      break;
    default:
      setBackgroungImage(windowFrame, cloudySrc);
  }
};

const getWeather = async () => {
  let weatherAPIKey = '';
  await db.collection("secret")
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      weatherAPIKey = doc.data().key;
    });
  });
  const lat = 37.5672135; //위도
  const lon = 127.0016985; //경도
  const lang = "en"; //언어
  const units = "metric"; //섭씨
  console.log(`현재 위도 및 경도 : ${lat}, ${lon} `);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=${lang}&units=${units}&appid=${weatherAPIKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const weather = data.weather[0].main;
      setWeather(weather);
    });
};

getWeather();

const teruFace01 = "./img/teruteru/face01.svg";
const teruFace02 = "./img/teruteru/face02.svg";
const teruFace03 = "./img/teruteru/face03.svg";

const pullTeru = (teru) => {
  teru.style.top = "0px";
  teru.childNodes[3].classList.remove("face02");
  teru.childNodes[3].classList.add("face01");
  setTimeout(() => {
    teru.style.top = "-20px";
    teru.childNodes[3].classList.remove("face01");
    teru.childNodes[3].classList.add("face03");
  }, 250);
  setTimeout(() => {
    teru.childNodes[3].classList.remove("face03");
    teru.childNodes[3].classList.add("face02"); 
  }, 1000);
};

const resetTeru = () => {
  terus.forEach((teru) => {
    teru.style.top = "-100px";
    teru.childNodes[3].classList.remove("face01", "face03");
    teru.childNodes[3].classList.add("face02");
  });
};

const terus = document.querySelectorAll(".teruteru");

terus.forEach((teru) => {
  teru.addEventListener("click", () => {
    windowAnimationStart();
    const nextWeather = teru.dataset.weather;
    resetTeru();
    pullTeru(teru);

    if (windowBox.classList.contains("closed") === false) {
      closeBlinds();
      setTimeout(() => {
        openBlinds();
        setWeather(nextWeather);
      }, 1000);
      setTimeout(() => {
        windowAnimationEnd();
      }, 2000);
    } else {
      openBlinds();
      setWeather(nextWeather);
      windowBox.classList.toggle("closed");
      setTimeout(() => {
        windowAnimationEnd();
      }, 1000);
    }
  });
});
