const alarmTime = document.getElementById('alarmTime')
const alarmName = document.getElementById('alarmName')
const setAlarm = document.querySelector(".setAlarm");
const btnCancel = document.querySelector('.btn-cancel');
const selectAud = document.querySelector('.selectAud');
const upload = document.getElementById('upload') 
const addAlarm = document.querySelector('.btn-addAlarm')
const alarmDetails = document.querySelector('.alarm-details')
const edit = document.querySelector('.edit')
const home = document.querySelector('.home')
const timeoutBox = document.querySelector('.timeout')
timeoutBox.innerHTML = ''

addAlarm.addEventListener('click', function () {
    edit.classList.add('edit-org')
    home.style.display = 'none'
    console.log('as')
})

let historyArr = [];
let audioArr = []
let alarmSound = new Audio('audio/mixkit-alarm-tone-996.wav')

upload.addEventListener('change', function () {
    const file = upload.files[0]
    alarmSound = new Audio(URL.createObjectURL(file))
})

let timeoutDisplayed = false; 

const timeout = function (label, id, aud) {
  let content = `<div class="timeout-overlay">
  <div class="timeout-box">
    <div class="timeout-comp">
      <h1>${label}</h1>
      <div class="btn-snooze">Snooze</div>
    </div>
    <div class="btn-stop">Stop</div>
  </div>
</div>`;
timeoutBox.innerHTML = content;
 document.querySelector('.timeout-box').style.animation = 'slideDown .5s ease-in'
 document.querySelector('.timeout-overlay').style.animation = 'fadeIn .5s ease-in'
 const stopBtn = document.querySelector('.btn-stop')
 const snoozeBtn = document.querySelector('.btn-snooze')
 
 snoozeBtn.addEventListener('click', function () {
  snooze(label, id, aud)
  aud.pause()
  document.querySelector('.timeout-box').style.animation = 'slideUp .5s ease-out'
  document.querySelector('.timeout-overlay').style.animation = 'fadeOut .5s ease-in'
  setTimeout(function () {
    document.querySelector('.timeout').innerHTML = ''
  }, 500)
})
 stopBtn.addEventListener('click', function () {
  aud.pause()
  document.querySelector('.timeout-box').style.animation = 'slideUp .5s ease-out'
  document.querySelector('.timeout-overlay').style.animation = 'fadeOut .5s ease-in'
  setTimeout(function () {
    document.querySelector('.timeout').innerHTML = ''
  }, 500)
})

// settime out
setTimeout(function () {
  aud.pause()
  document.querySelector('.timeout-box').style.animation = 'slideUp .5s ease-out'
  document.querySelector('.timeout-overlay').style.animation = 'fadeOut .5s ease-in'
  document.querySelector('.timeout').innerHTML = ''
}, 4000)
}


// compare current time with alarm time
function timer(arr) {
  arr.forEach(ev => {
     const setAlarm = setInterval (function () {
      const date = new Date();
      const curHours = date.getHours();
      const curMin = date.getMinutes();
      const curSec = date.getSeconds();
      const [alarmHour, alarmMin] = ev.time.split(':')  
      console.log(curHours, curMin, curSec);
      console.log(alarmHour, alarmMin, ev.id)
      if(Number(curHours) === Number(alarmHour)  && Number(curMin) === Number(alarmMin)) {
          timeout(ev.label, ev.id, ev.audio)
          ev.audio.play()
          ev.audio.loop = true;
          clearInterval(setAlarm)
      }
    }, 1000)
  })
}


const homePage = function () {
  edit.classList.remove('edit-org')
  home.style.display = 'block'
  home.classList.add('home-org')
}



const updateDetails = function (arr) {
  let html = '';
  arr.forEach((ev, i) => {
    html += `<div class="alarm-detail">
    <div class="">
      <h1 class="alarm-detail-time">${ev.time}</h1>
      <p class="alarm-detail-label">${ev.label ? ev.label : 'Alarm'}</p>
    </div>
    <div class="alarm-detail-right">
    <img src="img/x (1).svg" alt="" class="del-btn">
    <p class="snoozed" data-snoozeId = ${ev.id}></p>
  </div>
  </div>`
  })
  alarmDetails.innerHTML = html
  homePage()
}

function snooze (label, id, aud) {
  let timeMin = 1;
let timeSec = 10
const snoozeHtml = document.querySelectorAll('.snoozed')
console.log(snoozeHtml)
snoozeHtml.forEach(ev => {
    console.log(ev.dataset.snoozeid)
})
  const snoozeInt = setInterval(function () {
    timeSec--
    const min = String(timeMin - 1).padStart(2, 0)
    const sec = String(timeSec).padStart(2, 0)

    if (timeSec === 0) {
      timeSec = 60
      timeMin--
    }

    if (timeMin === 0 && timeSec === 60) {
      aud.play()
      timeout(label, id, aud)
      clearInterval(snoozeInt)
    }
    snoozeHtml.forEach(ev => {
      if (id === ev.dataset.snoozeid) {
        ev.innerHTML = `Snoozed: ${min}:${sec}`
        console.log(`Snoozed: ${min}:${sec}`, '⭐⭐⭐💥💥')
      }
    })
  }, 1000)
}

// set alarm
setAlarm.addEventListener("click", function (e) {
  e.preventDefault();
  if (alarmTime.value === '') return;
  const generateUniqueID = (idLength) => [...Array(idLength).keys()].map((elem)=>Math.random().toString(36).substr(2, 1)).join("")
  const id = generateUniqueID(10)
  let obj = {time: alarmTime.value, label: alarmName.value, id:id, alarm: false, audio: alarmSound}
  historyArr.push(obj)
  console.log(historyArr)
  timer(historyArr);
  updateDetails(historyArr)
  alarmName.value = ''
  alarmTime.value = '';
});

btnCancel.addEventListener('click', homePage)


let currentlyPlayingAudio = null;
selectAud.addEventListener('click', function(e) {
    if (e.target.classList.contains('aud')) {
        const aud = e.target;
        console.log(aud.dataset.aud);
        alarmSound = new Audio(`${aud.dataset.aud}`);
    }

    if (e.target.classList.contains('play')) { 
        const aud = e.target.closest('.aud');
        console.log(aud.dataset.aud);

        if (currentlyPlayingAudio) {
          const [oldAudio, previousTar, siblingsTar] = currentlyPlayingAudio
          oldAudio.pause();
          previousTar.classList.toggle('hidden');
          siblingsTar.classList.toggle('hidden');
        }

        alarmSound = new Audio(`${aud.dataset.aud}`);
        e.target.classList.toggle('hidden');
        e.target.nextElementSibling.classList.toggle('hidden');
        alarmSound.play();
        currentlyPlayingAudio = [alarmSound, e.target,  e.target.nextElementSibling];
    }

    if (e.target.classList.contains('pause')) { 
        e.target.classList.toggle('hidden');
        e.target.previousElementSibling.classList.toggle('hidden');
        alarmSound.pause();
        currentlyPlayingAudio = null;
    }
});

