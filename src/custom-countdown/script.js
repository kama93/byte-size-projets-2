const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('form');
const dateEl = document.getElementById('date-picker');
const countdownEl = document.getElementById('countdown');
const coundownElTitle = document.getElementById('countdown-title');
const coundownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24

// Set today date
const today= new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate countdown
function updateDom(){
    countdownActive=setInterval(()=>{
    const now= new Date().getTime();
    const distance= countdownValue-now;

    const days=Math.floor(distance / day);
    const hours= Math.floor((distance % day) / hour);
    const minutes= Math.floor((distance % hour) / minute);
    const seconds= Math.floor((distance % minute) / second);

    // hidden input
    inputContainer.hidden=true;

    // if countdown is complete
    if (distance < 0){
        countdownEl.hidden=true;
        clearInterval(countdownActive);
        completeElInfo.textContent=`${countdownTitle} finished on ${countdownDate}`;
        completeEl.hidden=false;
    }
    else{
        coundownElTitle.textContent= `${countdownTitle}`;
        timeElements[0].textContent=`${days}`;
        timeElements[1].textContent=`${hours}`;
        timeElements[2].textContent=`${minutes}`;
        timeElements[3].textContent=`${seconds}`;
        completeEl.hidden=true;
        countdownEl.hidden=false;
    }
}, second);

}

// Get values from input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown={
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // check for valid date
    if (countdownDate===''){
        alert('Please select a date for the countdown.')
    } else{
         // get current date and update DOM
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

// Reset all values
function reset(){
    countdownEl.hidden = true;
    completeEl.hidden=true;
    inputContainer.hidden = false;
    clearInterval(countdownActive);
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown(){
    if(localStorage.getItem('countdown')){
        inputContainer.hidden=true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

// Event Listner
countdownForm.addEventListener('submit', updateCountdown);
coundownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check local storage
restorePreviousCountdown()