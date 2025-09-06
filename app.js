import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const memoCol = collection(db, "memos");

const calendar = document.getElementById("calendar");
const memoModal = document.getElementById("memoModal");
const memoDateEl = document.getElementById("memoDate");
const memoContent = document.getElementById("memoContent");
const memoDetails = document.getElementById("memoDetails");
const saveMemo = document.getElementById("saveMemo");
const closeModal = document.getElementById("closeModal");

let selectedDate = null;

function renderCalendar() {
  calendar.innerHTML = "";
  const weekdays = ["월","화","수","목","금","토","일"];
  weekdays.forEach(day => {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = day;
    calendar.appendChild(dayEl);
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for(let i=1; i<=daysInMonth; i++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.textContent = i;
    dayEl.addEventListener("click", () => openMemoModal(`${year}-${month+1}-${i}`));
    calendar.appendChild(dayEl);
  }

  loadMemos();
}

async function loadMemos() {
  const snapshot = await getDocs(memoCol);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const dayCells = Array.from(document.getElementsByClassName("day"));
    dayCells.forEach(cell => {
      if(cell.textContent === data.date.split('-')[2]) {
        const memoEl = document.createElement("div");
        memoEl.className = "memo";
        memoEl.textContent = data.content;
        memoEl.addEventListener("click", () => openMemoModal(data.date, docSnap.id, data));
        cell.appendChild(memoEl);
      }
    });
  });
}

function openMemoModal(date, docId=null, data=null) {
  selectedDate = {date, docId};
  memoDateEl.textContent = date;
  memoContent.value = data ? data.content : "";
  memoDetails.value = data ? data.details : "";
  memoModal.style.display = "flex";
}

saveMemo.addEventListener("click", async () => {
  if(selectedDate.docId) {
    await updateDoc(doc(memoCol, selectedDate.docId), {
      content: memoContent.value,
      details: memoDetails.value
    });
  } else {
    await addDoc(memoCol, {
      date: selectedDate.date,
      content: memoContent.value,
      details: memoDetails.value
    });
  }
  memoModal.style.display = "none";
  renderCalendar();
});

closeModal.addEventListener("click", () => {
  memoModal.style.display = "none";
});

renderCalendar();
