export class Timer {
  id = 'timer-' + Math.random().toString(16).slice(2);
  element = document.createElement('li');
  // dateEnabled = new Date(); //TODO dateEnable
  ringtone = new Audio('../src/resources/sfx.mp3');
  state = 'on'; //NOTE -state list ['on', 'off', 'ringing']

  constructor(formData) {
    const { hours, minutes, seconds, label } = formData;

    this.totalSeconds = +hours * 3600 + +minutes * 60 + +seconds;
    this.remainingSeconds = this.totalSeconds;
    this.time = { hours, minutes, seconds };
    // this.label = label;

    {
      this.element.className = 'timer';
      this.element.id = this.id;
      this.element.innerHTML = `
      <div class="timer__time">${this.formattedTime}</div>
      <button class="timer__btn-status-control">🔃</button>
      <div class="timer__label">${label}</div>
      <input class="timer__status" type="checkbox" checked/>
      <button class="timer__btn-delete">&times;</button>`;
    }

    this.el_time = this.element.querySelector('.timer__time');
    this.el_statusToggle = this.element.querySelector('.timer__status');
    this.el_btnStatusControl = this.element.querySelector(
      '.timer__btn-status-control'
    );

    this.#startCountDown();
  }

  set #newState(newState) {
    this.state = newState;
    const updateIcon /* el_btnStatusControlIcon */ = (icon) =>
      (this.el_btnStatusControl.innerText = icon);

    switch (newState) {
      /*  case 'on':
        
        break; */

      case 'off':
        this.el_statusToggle.checked = false;
        break;

      case 'ringing':
        updateIcon('⏰');
        break;

      default:
        updateIcon('🔃');
        break;
    }
  }

  #startCountDown() {
    this.interval = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        this.ringtone.play();
        this.ringtone.loop = true;
        // debugger;
        clearInterval(this.interval);
        this.#newState = 'ringing';
        //TODO -do something when timer ends
      } else {
        this.remainingSeconds--;
        this.el_time.innerText = this.formattedTime;
      }
    }, 1000);
  }

  resetTimer() {
    this.remainingSeconds = this.totalSeconds;
    this.el_time.innerText = this.formattedTime;
    this.#newState = 'on';
    if (!this.ringtone.paused) {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
      this.#newState = 'off';
    }
    // this.dateEnabled = new Date(); //TODO - dateEnable
  }

  //FIXME - current
  updateStatus(isEnabled = true) {
    clearInterval(this.interval);
    if (isEnabled) {
      this.#startCountDown();
      this.state = 'on';
    } else this.state = 'off';
  }

  get formattedTime() {
    const ts = this.remainingSeconds;
    const days = Math.floor(ts / (60 * 60 * 24));
    const hours = Math.floor((ts % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((ts % (60 * 60)) / 60);
    const seconds = Math.floor(ts % 60);

    let result = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (days < 1) {
      result = `${hours}h ${minutes}m ${seconds}s`;
      if (hours < 1) result = `${minutes}m ${seconds}s`;
    }

    return result;
  }
}
