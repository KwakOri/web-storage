
let lastScrollY = 0;

function onScroll() {
  const navback = document.querySelector('.nav-back');
  const navbar = document.getElementsByClassName('nav-text');
  const STANDARD = 70;
  
  if (window.scrollY > STANDARD) {
    navback.classList.add('nav-scroll');
    for (let item of navbar) {
      item.classList.add('black');
      item.classList.remove('white');
    };
    
  } else {
    navback.classList.remove('nav-scroll');
    for (let item of navbar) {
      item.classList.add('white');
      item.classList.remove('black');  
    }
  }
}

window.addEventListener('scroll', onScroll);