import { db } from "./firebase-config.js";
import { collection, doc, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let selectedDate = new Date();
let selectedMemoId = null;

const calendarEl = document.getElementById('calendar');
const monthYearEl = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const modal = document.getElementById('memoModal');
const closeModal = modal.querySelector('.close');
const memoText = document.getElementById('memoText');
const addMemoBtn = document.getElementById('addMemo');
const memoList = document.getElementById('memoList');
const modalDateEl = document.getElementById('modalDate');

function renderCalendar(date){
  calendarEl.innerHTML = '';
  const year = date.getFullYear();
  const month = date.getMonth();
  monthYearEl.textContent = `${year}년 ${month+1}월`;

  const firstDay = new Date(year, month,1);
  const lastDay = new Date(year, month+1,0);
  const startWeek = (firstDay.getDay()+6)%7; // 월요일 시작
  const totalDays = lastDay.getDate();

  for(let i=0;i<startWeek;i++){
    const empty = document.createElement('div');
    calendarEl.appendChild(empty);
  }

  for(let day=1; day<=totalDays; day++){
    const dayEl = document.createElement('div');
    dayEl.className='day';
    dayEl.dataset.day=day;
    dayEl.innerHTML=`<div class="day-number">${day}</div><div class="memo-preview" id="memo-${day}"></div>`;
    dayEl.addEventListener('click',()=>openModal(year, month, day));
    calendarEl.appendChild(dayEl);
    loadMemos(year, month, day);
  }
}

prevMonthBtn.onclick=()=>{selectedDate.setMonth(selectedDate.getMonth()-1); renderCalendar(selectedDate);}
nextMonthBtn.onclick=()=>{selectedDate.setMonth(selectedDate.getMonth()+1); renderCalendar(selectedDate);}

function openModal(y,m,d){
  modal.style.display='flex';
  selectedDate = new Date(y,m,d);
  modalDateEl.textContent=`${y}년 ${m+1}월 ${d}일`;
  memoText.value='';
  selectedMemoId=null;
  loadMemoList(y,m,d);
}

closeModal.onclick=()=>{modal.style.display='none';}

window.onclick = function(e){ if(e.target==modal) modal.style.display='none'; }

async function loadMemos(y,m,d){
  const snapshot = await getDocs(collection(db,'memos'));
  snapshot.forEach(docu=>{
    const data = docu.data();
    const docDate = new Date(data.date);
    if(docDate.getFullYear()==y && docDate.getMonth()==m && docDate.getDate()==d){
      const memoEl = document.getElementById(`memo-${d}`);
      memoEl.textContent = data.content.split('\n').slice(0,2).join('\n');
    }
  });
}

async function loadMemoList(y,m,d){
  memoList.innerHTML='';
  const snapshot = await getDocs(collection(db,'memos'));
  snapshot.forEach(docu=>{
    const data = docu.data();
    const docDate = new Date(data.date);
    if(docDate.getFullYear()==y && docDate.getMonth()==m && docDate.getDate()==d){
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.textContent=data.content;
      span.onclick=()=>{ memoText.value=data.content; selectedMemoId=docu.id; };
      const delBtn = document.createElement('button');
      delBtn.textContent='삭제';
      delBtn.onclick=async e=>{
        e.stopPropagation();
        if(confirm('정말 삭제하시겠습니까?')){
          await deleteDoc(doc(db,'memos',docu.id));
          loadMemoList(y,m,d);
          renderCalendar(selectedDate);
        }
      };
      div.appendChild(span);
      div.appendChild(delBtn);
      memoList.appendChild(div);
    }
  });
}

addMemoBtn.onclick=async ()=>{
  const content = memoText.value.trim();
  if(!content) return alert('메모를 입력하세요.');
  const newDoc = selectedMemoId ? doc(db,'memos',selectedMemoId) : doc(collection(db,'memos'));
  await setDoc(newDoc,{
    content,
    date:selectedDate.toISOString()
  });
  memoText.value='';
  selectedMemoId=null;
  loadMemoList(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate());
  renderCalendar(selectedDate);
}

renderCalendar(selectedDate);
