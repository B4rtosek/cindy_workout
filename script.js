const TOTAL = 20 * 60;
const timerEl = document.getElementById('timer');
const counterEl = document.getElementById('counter');
const hint = document.getElementById('hint');
const minuteSound = new Audio('minute.mp3');
const finishSound = new Audio('finish.mp3');
let started = false, count = 0, endTime, lastSecs = TOTAL;

function render(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  timerEl.textContent = `${m}:${s}`;
}

function tick() {
  const secs = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  if (secs !== lastSecs) {
    lastSecs = secs;
    render(secs);
    if (secs === 0) {
      clearInterval(interval);
      timerEl.classList.add('done');
      finishSound.play();
    } else if (secs % 60 === 0) {
      minuteSound.play();
    }
  }
}

let interval;

// Mobile browsers only allow audio that was first started by a user gesture.
function unlockAudio() {
  [minuteSound, finishSound].forEach(a => {
    a.muted = true;
    a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
      .catch(() => { a.muted = false; });
  });
}
function press() {
  if (!started) {
    started = true;
    unlockAudio();
    hint.textContent = 'Press SPACE or tap to count';
    endTime = Date.now() + TOTAL * 1000;
    interval = setInterval(tick, 200);
  } else if (lastSecs > 0) {
    counterEl.textContent = ++count;
  }
}

document.addEventListener('keydown', e => {
  if (e.code !== 'Space' || e.repeat) return;
  e.preventDefault();
  press();
});

// touchstart + preventDefault suppresses the follow-up synthetic mouse events,
// so a tap is never counted twice.
window.addEventListener('touchstart', e => {
  e.preventDefault();
  press();
}, { passive: false });

window.addEventListener('mousedown', e => {
  if (e.button === 0) press();
});
