const alarmTime = document.getElementById('alarmTime')
const alarmName = document.getElementById('alarmName')
const setAlarm = document.querySelector(".setAlarm");
const btnCancel = document.querySelector('.btn-cancel');
const selectAudio = document.querySelector('.selectAud');
const uploadFile = document.getElementById('upload') 
const addAlarm = document.querySelector('.btn-addAlarm')
const alarmDetails = document.querySelector('.alarm-details')
const edit = document.querySelector('.edit')
const home = document.querySelector('.home')
const choosenAudioText = document.querySelector('.choosen-audio-text')
const timeoutBox = document.querySelector('.timeout')

let fileChoose = false;
let currentAlarmAudioPlaying = null;
let currentlyPlayingAudio = null;
// let stopOrSnoozeBtnClicked = false
let selectedAudio = 'audio/mixkit-alarm-tone-996.wav'
choosenAudioText.textContent = 'Alarm Tone (Default)'

let historyArr = localStorage.getItem('historyData') ? JSON.parse(localStorage.getItem('historyData')) : []

document.addEventListener('DOMContentLoaded', function () {
timer(historyArr)
updateDetails(historyArr)
})

//Displays current time 
const currentTime = setInterval (function () {
  const date = new Date();
  const hrs = String(date.getHours()).padStart(2, 0)
  const min = String(date.getMinutes()).padStart(2, 0)
  const sec = String(date.getSeconds()).padStart(2, 0)
  currentTimeDisplay.textContent = `${hrs}:${min}:${sec}`
}, 1000)

//A function that generate random id
const generateUniqueID = (idLength) => [...Array(idLength).keys()].map((elem)=>Math.random().toString(36).substr(2, 1)).join("")


//Edit and Add an Alarm to your alarm list
addAlarm.addEventListener('click', function () {
  edit.classList.add('edit-org')
  home.style.display = 'none'
  console.log('as')
})

//Go back to home page
const homePage = function () {
  edit.classList.remove('edit-org')
  home.style.display = 'block'
  home.classList.add('home-org')
  uploadFile.value = '';
}

btnCancel.addEventListener('click', homePage)

//When your alarm time is due, this function shows alarm message
const timeout = function(obj, label, id, audio) {
  timeoutBox.innerHTML = '';
  //checks if an alarm is currently playing, if true the audio stop and the alarm is cleared
  if (currentAlarmAudioPlaying) {
    const previousAudio =  new Audio(currentAlarmAudioPlaying)
    previousAudio.pause();
    previousAudio.currentTime = 0; // Reset audio to the beginning
  }

        // Play the audio immediately
        const audioElement = new Audio(audio);
        audioElement.loop = true;
        audioElement.play()
          .then(() => {
            currentAlarmAudioPlaying = audioElement;
          })
          .catch(error => {
            console.error('Error playing audio:', error);
          });

  // Display timeout overlay
  let content = `<div class="timeout-overlay">
    <div class="timeout-box">
      <div class="timeout-comp">
        <h1>${label ? label : 'Alarm'}</h1>
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

 //clears display message
 function clearMsg () {
  audioElement.pause()
  document.querySelector('.timeout-box').style.animation = 'slideUp .5s ease-out'
  document.querySelector('.timeout-overlay').style.animation = 'fadeOut .5s ease-in'
  setTimeout(function () {
    timeoutBox.innerHTML = ''
  }, 500)
  currentAlarmAudioPlaying = null 
  obj.stopOrSnoozeBtnClicked = true
}
 
 //Snooze alarm buttton
 snoozeBtn.addEventListener('click', function () {
  snooze(label, id, audio)
  clearMsg()
})
 
//Stop alarm button
 stopBtn.addEventListener('click', function () {
  clearMsg()
})

currentAlarmAudioPlaying = audio;
}

// compare each in the historyArr current time with alarm time
function timer(arr) {
  arr.forEach(ev => {
     const setAlarm = setInterval (function () {
      const date = new Date();
      const curHours = date.getHours();
      const curMin = date.getMinutes();
      const [alarmHour, alarmMin] = ev.time.split(':')  
      if(Number(curHours) === Number(alarmHour)  && Number(curMin) === Number(alarmMin)) {
          if(ev.stopOrSnoozeBtnClicked) return;
          timeout(ev, ev.label, ev.id, ev.audio)
          clearInterval(setAlarm)
          console.log(ev)
      }
    }, 1000)
  })
}

//update alarm lists
const updateDetails = function (arr) {
  let html = '';
  arr.forEach((ev, i) => {
    html += `<div class="alarm-detail">
    <div class="">
      <h1 class="alarm-detail-time">${ev.time}</h1>
      <p class="alarm-detail-label">${ev.label ? ev.label : 'Alarm'}</p>
    </div>
    <div class="alarm-detail-right">
    <img src="img/x (1).svg" alt="" class="del-btn" data-index = ${i}>
    <p class="snoozed" data-snoozeId = ${ev.id}></p>
  </div>
  </div>`
  })
  alarmDetails.innerHTML = html
  homePage()
}

//Snoozing function 
function snooze (label, id, aud) {
let timeMin = 2;
let timeSec = 60;
const snoozeHtml = document.querySelectorAll('.snoozed')
  const snoozeInt = setInterval(function () {
    timeSec--
    const min = String(timeMin - 1).padStart(2, 0)
    const sec = String(timeSec).padStart(2, 0)

    if (timeSec === 0) {
      timeSec = 60
      timeMin--
    }

    if (timeMin === 0 && timeSec === 60) {
      timeout(label, id, aud)
      clearInterval(snoozeInt)
    }
    snoozeHtml.forEach(ev => {
      if (id === ev.dataset.snoozeid) {
        ev.innerHTML = `Snoozed: ${min}:${sec}`
        console.log(`Snoozed: ${min}:${sec}`)
      }
    })
  }, 1000)
}

// set alarm
setAlarm.addEventListener("click", function (e) {
  e.preventDefault();
  if (alarmTime.value === '') return;
  const id = generateUniqueID(10)
  let obj = {time: alarmTime.value, label: alarmName.value, id:id, audio: selectedAudio, stopOrSnoozeBtnClicked: false}
  historyArr.push(obj)
  localStorage.setItem('historyData', JSON.stringify(historyArr))
  historyArr = JSON.parse(localStorage.getItem('historyData'))
  timer(historyArr);
  updateDetails(historyArr);
  alarmName.value = ''
  alarmTime.value = '';
  console.log(historyArr)
});

// const delBtn = document.querySelectorAll('.del-btn')
alarmDetails.addEventListener('click', function (e) {
  if (e.target.classList.contains('del-btn')) {
   const i = e.target.dataset.index
   console.log(i)
   historyArr.splice(i, 1)
   localStorage.setItem('historyData', JSON.stringify(historyArr))
    historyArr = JSON.parse(localStorage.getItem('historyData'))
    updateDetails(historyArr)
    console.log(historyArr)
  }
})

// Uplaod a music file as an alarm audio
uploadFile.addEventListener('change', function () {
  if (!fileChoose) {
    const file = uploadFile.files[0]
    selectedAudio = URL.createObjectURL(file)
    // alarmSound = new Audio(URL.createObjectURL(file))
    choosenAudioText.textContent = '.mp3'
    fileChoose = true
  }
})

//updates alarm audio and user can also play audio 
selectAudio.addEventListener('click', function(e) {
    if (e.target.classList.contains('aud')) {
      if (fileChoose) uploadFile.value = ''
        const aud = e.target;
        console.log(aud.dataset.aud);
        selectedAudio = aud.dataset.aud
        // alarmSound = new Audio(`${aud.dataset.aud}`);
        choosenAudioText.textContent = aud.textContent
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

        alarmSound = new Audio(`${aud.dataset.aud}`)
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

