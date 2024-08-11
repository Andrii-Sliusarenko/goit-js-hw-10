import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysOutput = document.querySelector('[data-days]');
const hoursOutput = document.querySelector('[data-hours]');
const minutesOutput = document.querySelector('[data-minutes]');
const secondsOutput = document.querySelector('[data-seconds]');

startBtn.addEventListener('click', startTimer);

let intervalId = null;
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      return iziToast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
    }
    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
    startBtn.style.backgroundColor = '#4E75FF';
    startBtn.style.color = '#FFF';
  },
};

flatpickr(datePicker, options);

function startTimer() {
  intervalId = setInterval(updateTimer, 1000);
  datePicker.disabled = true;
  startBtn.disabled = true;
}

function updateTimer() {
  const currentTime = userSelectedDate - new Date();

  if (currentTime <= 0) {
    datePicker.disabled = false;
    clearInterval(intervalId);
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(currentTime);
  daysOutput.textContent = String(days).padStart(2, 0);
  hoursOutput.textContent = String(hours).padStart(2, 0);
  minutesOutput.textContent = String(minutes).padStart(2, 0);
  secondsOutput.textContent = String(seconds).padStart(2, 0);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
