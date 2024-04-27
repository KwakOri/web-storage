// JavaScript로 탭을 관리
function openTab(tabName) {
  // 모든 탭 숨기기
  var tabs = document.getElementsByClassName("custom-box");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  // 선택한 탭 표시
  document.getElementById(tabName).style.display = "grid";
}
let btns = document.querySelectorAll(".nav-link");
btns.forEach((selectedBtn) => {
  selectedBtn.addEventListener("click", (e) => {
    btns.forEach((btn) => {
      btn.classList.remove("active");
    });
    selectedBtn.classList.add("active");
  });
});

let adBanner = document.querySelector('.ad-area');
let adCloseBtn = document.querySelector('.ad-close');

adCloseBtn.addEventListener('click', () => {
  adBanner.style.height = 0;
  adBanner.style.opacity = 0;
  setTimeout(() => {
    adBanner.style.display= "none";
  }, 1000)
})