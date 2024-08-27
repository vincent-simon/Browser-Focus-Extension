let timerDuration = 25 * 60; // Default 25 minutes
let timerInterval;
let remainingTime;

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    document.querySelector('.timer-display').textContent = formatTime(remainingTime);
    setProgress((remainingTime / timerDuration) * 100);
}

function startTimer() {
    remainingTime = timerDuration;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon32.png',
                title: 'Focus Session Complete',
                message: 'Great job! Take a short break before your next session.'
            });
        }
    }, 1000);
}

document.getElementById('startTimer').addEventListener('click', function() {
    clearInterval(timerInterval);
    startTimer();
});

// ... (previous code for toggle focus and options) ...

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleFocus');
  const optionsButton = document.getElementById('options');

  // Initialize the toggle button based on the current focus mode
  chrome.storage.local.get(['focusMode'], function(result) {
      updateToggleButtonText(result.focusMode);
  });

  // Add event listener to the toggle button
  toggleButton.addEventListener('click', function() {
      toggleFocusMode();
  });

  // Open options page when options button is clicked
  optionsButton.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
  });
});

function updateToggleButtonText(focusMode) {
  const toggleButton = document.getElementById('toggleFocus');
  toggleButton.textContent = focusMode ? 'Stop Focus' : 'Start Focus';
}

function toggleFocusMode() {
  chrome.storage.local.get(['focusMode'], function(result) {
      const newFocusMode = !result.focusMode;
      chrome.storage.local.set({ focusMode: newFocusMode }, function() {
          updateToggleButtonText(newFocusMode);
      });
  });
}

// Load custom timer duration
chrome.storage.sync.get(['timerDuration'], function(result) {
  if (result.timerDuration) {
      timerDuration = result.timerDuration * 60;
  }
  updateTimerDisplay();
});
