const slideBox1 = document.querySelector(".sect1 .container");
const slides1 = document.querySelectorAll(".sect1 .container a");
const slide1Btns = document.querySelectorAll(".sect1 .btn");
const nextBtn = document.querySelector(".sect1 .next");
const prevBtn = document.querySelector(".sect1 .prev");

let slideIdx = 0;
const slideCount = slides1.length;
const slideWidth = 620;
const slideMargin = 40;

makeClone();

function makeClone(){
  for (let i = 0; i < slides1.length; i++) {
    const cloneSlide = slides1[i].cloneNode(true);
    cloneSlide.classList.add("clone");
    slideBox1.appendChild(cloneSlide);
  }

  for ( let i = slideCount - 1; i >= 0; i--) {
    const cloneSlide = slides1[i].cloneNode(true);
    cloneSlide.classList.add("clone");
    slideBox1.prepend(cloneSlide);
  }
  updateWidth();
  setPos();
  setTimeout(function() {
    slideBox1.classList.add("animated");
  }, 500);
  
}

function updateWidth() {
  const currentSlides = document.querySelectorAll(".sect1 .container a");
  const newSlideCount = currentSlides.length;
  const newWidth = (slideWidth + slideMargin) * newSlideCount - slideMargin + 'px';
  slideBox1.style.width = newWidth;
}

function setPos() {
  const initialPos = -(slideWidth + slideMargin) * slideCount;
  slideBox1.style.transform = `translateX(${initialPos}px)`;
}

function movingSlide() {
  slideBox1.style.left = `${slideIdx * -660}px`;

  if (slideIdx == slideCount || slideIdx == -slideCount) {
    setTimeout(function(){
      slideBox1.classList.remove("animated");
      slideIdx = 0;
      slideBox1.style.left = `${slideIdx * -660}px`;
    }, 300);
    setTimeout(function(){
      slideBox1.classList.add("animated");
    }, 350);
  }

  for (let btn of slide1Btns) {
    btn.classList.remove("on");
  }
  if (slideIdx < 0) {
    const backSlide = slideCount + slideIdx;
    slide1Btns[backSlide].classList.add("on");  
  } else if (slideIdx == 8){
    slide1Btns[0].classList.add("on");
  } else {
    slide1Btns[slideIdx].classList.add("on");
  }
}

prevBtn.addEventListener("click", function() {
  prevBtn.classList.add("stopMouse");
  slideIdx -= 1;
  movingSlide();
  setTimeout(function(){
    prevBtn.classList.remove("stopMouse");
  }, 400);
});

nextBtn.addEventListener("click", function() {
  slideIdx += 1;
  movingSlide();
});

for (let i = 0; i < slide1Btns.length; i++) {
  slide1Btns[i].addEventListener("click", function(){
    slideIdx = i;
    slideBox1.style.left = `${slideIdx * -660}px`;
    for (let btn of slide1Btns) {
      btn.classList.remove("on");
    }
    slide1Btns[i].classList.add("on");
  })
}

function autoSliding() {
  slideIdx += 1;
  movingSlide();
}

setInterval(autoSliding, 5000);