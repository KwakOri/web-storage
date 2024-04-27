const firebaseConfig = {
  apiKey: "AIzaSyCzNxdnZKBGObRbWt5gML4QxE-Q_vF5y_k",
  authDomain: "zusizo-web-site.firebaseapp.com",
  projectId: "zusizo-web-site",
  storageBucket: "zusizo-web-site.appspot.com",
  messagingSenderId: "68338919855",
  appId: "1:68338919855:web:8f35ce792e8fe33547e75a",
  measurementId: "G-TL8B0BGMG5",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const submitBtn = document.querySelector(".submitbtn");
const showFormBtn = document.querySelector("#showEntryForm");

// 방명록 작성하기 버튼 클릭 시 폼 보이기/감추기
document.getElementById("showEntryForm").addEventListener("click", function () {
  var form = document.getElementById("entryForm");
  const isVisible = form.classList["value"].includes("visible");
  if (isVisible) {
    form.classList.toggle("usable");
    showFormBtn.classList.toggle("click-block");
    setTimeout(() => {
      form.classList.toggle("visible");
    }, 200);
    setTimeout(() => {
      showFormBtn.classList.toggle("click-block");
    }, 500);
    console.log(form.classList);
  } else {
    var form = document.getElementById("entryForm");
    showFormBtn.classList.toggle("click-block");
    form.classList.toggle("visible");
    setTimeout(() => {
      form.classList.toggle("usable");
      showFormBtn.classList.toggle("click-block");
    }, 500);
    console.log(form.classList);
  }
});

const newDiv = document.getElementById("btnbtn");
newDiv.innerHTML = "";

// Firebase에서 방명록 데이터 가져오기 및 실시간 업데이트
  db.collection("guest-book").onSnapshot((snapshot) => {
    const guestBook = document.querySelector(".guest-book #btnbtn");
    // const guestBookhi = document.createElement("div"); 

    snapshot.docChanges().forEach((change) => {
      console.log('change:', change);
      if (change.type === "added") {
        // 추가된 데이터 처리
        const post = change.doc.data();
        const li = document.createElement("li");
        li.id = change.doc.id;
        li.classList.add("post");
        // 사용자, 날짜, 설명 요소 생성 및 추가
        const userNameElement = document.createElement("p");
        userNameElement.classList.add("user");
        userNameElement.textContent = post["username"];
        li.appendChild(userNameElement);

        const dateElement = document.createElement("p");
        dateElement.classList.add("date");
        const datetime = new Date(post["date"]["seconds"] * 1000);
        const year = datetime.getFullYear();
        const month = datetime.getMonth() + 1;
        const date = datetime.getDate();
        let hours = datetime.getHours();
        if (hours === 0) {
          hours = 24;
        } else if (hours > 24) {
          hours -= 12;
        }
        const minutes = datetime.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "오후" : "오전";
        const timeString = `${ampm} ${hours}:${minutes}`;
        dateElement.textContent = `${year}년 ${month}월 ${date}일 ${timeString}`;
        li.appendChild(dateElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("explain");
        descriptionElement.textContent = post["description"];
        li.appendChild(descriptionElement);

        // 삭제 버튼 추가
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function () {
          // 방명록 삭제 기능 구현
          const postId = change.doc.id;
          db.collection("guest-book")
            .doc(postId)
            .delete()
            .then(() => {
              console.log("Document successfully deleted!");
            })
            .catch((error) => {
              console.error("Error deleting document: ", error);
            });
        });

        // 삭제 버튼 요소를 포스트에 추가
        li.appendChild(deleteBtn);

        // 포스트를 게스트북에 추가
        guestBook.appendChild(li);

        // guestBookhi.appendChild(li);
      } else if (change.type === "removed") {
        // 삭제된 데이터 처리
        const postId = change.doc.id;
        const postElement = document.getElementById(postId);
        if (postElement) {
          postElement.remove();
        }
      }
    });
    // newDiv.appendChild(guestBookhi); 
  });

// 방명록 작성 폼 제출 시 처리
document
  .getElementById("submitForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // 폼의 기본 동작 중단

    const username = this.querySelector('input[name="username"]').value;
    const message = this.querySelector('textarea[name="message"]').value;
    const today = new Date();
    const date = `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;

    if (username === "") {
      alert("이름을 입력해주세요");
      return;
    }

    if (message === "") {
      alert("내용을 입력해주세요");
      return;
    }

    // Firebase에 방명록 데이터 추가
    db.collection("guest-book")
      .add({
        username: username,
        description: message,
        date: new Date(),
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    // 폼 초기화
    this.reset();
  });

const functionBtns = [submitBtn, showFormBtn];
functionBtns.forEach((btn) => {
  btn.addEventListener("mousedown", () => {
    btn.classList.add("clicked");
  });
  btn.addEventListener("mouseup", () => {
    btn.classList.remove("clicked");
  });
});
