const sec2content = document.querySelector(".sec2 .contents");

window.addEventListener("scroll", function () {
  if (window.scrollY > 500) {
    sec2content.classList.add("showing");
  } else {
    sec2content.classList.remove("showing");
  }
});

const sec3slide1 = document.querySelector(".sec3 .item1");
const sec3slide2 = document.querySelector(".sec3 .item2");
const sec3slide3 = document.querySelector(".sec3 .item3");
const SHOWING_LEFT = "showingLeft";
const SHOWING_MIDDLE = "showingMiddle";
const SHOWING_RIGHT = "showingRight";

window.addEventListener("scroll", function () {
  if (window.scrollY > 800) {
    sec3slide2.classList.add(SHOWING_MIDDLE);
  } else {
    sec3slide2.classList.remove(SHOWING_MIDDLE);
  }
});
window.addEventListener("scroll", function () {
  if (window.scrollY > 1050) {
    sec3slide1.classList.add(SHOWING_LEFT);
    sec3slide3.classList.add(SHOWING_RIGHT);
  } else {
    sec3slide1.classList.remove(SHOWING_LEFT);
    sec3slide3.classList.remove(SHOWING_RIGHT);
  }
});

const sec4content = document.querySelector(".sec4 .contents");

window.addEventListener("scroll", function () {
  if (window.scrollY > 1500) {
    sec4content.classList.add("showing");
  } else {
    sec4content.classList.remove("showing");
  }
});