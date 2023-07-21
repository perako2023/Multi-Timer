'use strict';
import { Timer } from './js/timer_class.js';

const el_timers = document.querySelector('#timers');
const el_formAddTimer = document.querySelector('#add-timer');
const el_countdown = document.querySelector('#countdown');
const el_countdownHeader = document.querySelector('#countdown-header');

const activeTimers = new Map();

let closestToEndTimer = null;

el_timers.addEventListener('click', ({ target }) => {
  const targetTimer = target.closest('.timer');
  if (!targetTimer) return; //* return if targetTimer is null
  const timerMapRef = activeTimers.get(targetTimer.id); //REVIEW -

  switch (target.className) {
    case 'timer__btn-delete':
      deleteTimer(targetTimer.id);
      break;
    case 'timer__status':
      timerMapRef.updateStatus(target.checked);
      break;

    case 'timer__btn-status-control':
      timerMapRef.resetTimer();
      break;

    /* default:
      break; */
  }
});

el_formAddTimer.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  const newTimer = new Timer(formData);
  activeTimers.set(newTimer.id, newTimer);

  el_timers.appendChild(newTimer.element);

  el_formAddTimer.reset();
});

el_countdownHeader.addEventListener('click', (e) => {
  if (!closestToEndTimer) return; //* return if empty

  closestToEndTimer.element.scrollIntoView();
  closestToEndTimer.element.style.boxShadow =
    'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px';

  setTimeout(() => (closestToEndTimer.element.style.boxShadow = ''), 1000);
});

setInterval(() => {
  //TODO display the timer that is closest to end
  if (activeTimers.size === 0) {
    el_countdown.innerText = '1d 24h 60m 60s';
    return;
  }

  const filtered = [...activeTimers.values()].reduce(
    (filteredTimers, value) => {
      if (value.state === 'on')
        filteredTimers.push({ id: value.id, sec: value.remainingSeconds });
      return filteredTimers;
    },
    []
  );

  if (filtered.length === 0) return;

  const sorted = Object.values(filtered).sort((a, b) => a.sec - b.sec);

  closestToEndTimer = activeTimers.get(sorted[0].id);

  el_countdown.innerText = closestToEndTimer.formattedTime;
}, 0.5 * 1000);

function deleteTimer(timerID) {
  const target = activeTimers.get(timerID);
  if (!target) return; //* return if does NOT exist

  clearInterval(target.interval);
  target.element.remove();
  activeTimers.delete(timerID);
  closestToEndTimer = null;
}
