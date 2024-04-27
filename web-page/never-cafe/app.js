const catergoryLists = document.querySelectorAll(".category li"); 
const categoryBtns = document.querySelectorAll(".categoryBtn");

function redrawUnderline(e) {
  const currentOn = document.querySelector(".on");
  const li = e.target.parentElement;
  const underscore = document.createElement('div');
  const existingUnderscore = document.querySelector('.underscore');
  
  currentOn.classList.remove('on');
  li.classList.add('on');


  existingUnderscore.remove();
  
  underscore.classList.add('underscore');
  li.appendChild(underscore);
}

categoryBtns.forEach((btn) => {
  btn.addEventListener('click', redrawUnderline);
})

const adCloseBtn = document.querySelector(".btns a:first-child");
adCloseBtn.addEventListener('click', () => {
  let ad = document.querySelector(".ad");
  console.log(ad);
  adCloseBtn.style.opacity = "0";
  ad.style.height = "0";
});

const newPostsViewBtn = document.querySelector(".view-new-posts");
const toggleBox = document.querySelector(".toggle-box");
const toggleSlide = document.querySelector(".toggle-slide");

newPostsViewBtn.addEventListener('click', () => {
  toggleBox.classList.toggle('on');
  toggleSlide.classList.toggle('on');
  console.log(toggleBox.classList);
})

const slideControls = document.querySelectorAll(".slide-control a");
slideControls.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    slideControls.forEach((btn) => {
      btn.classList.remove('on');
    })
    
    e.target.classList.add('on');
  }) 
})

