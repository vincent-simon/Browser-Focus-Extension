// Function to update the toggle button text
function updateToggleButtonText(focusMode) {
    const toggleButton = document.getElementById('toggleFocus');
    toggleButton.textContent = focusMode ? 'Stop Focus' : 'Start Focus';
}

// Function to toggle focus mode
function toggleFocusMode() {
    chrome.storage.local.get(['focusMode'], function(result) {
        const newFocusMode = !result.focusMode;
        chrome.storage.local.set({focusMode: newFocusMode}, function() {
            updateToggleButtonText(newFocusMode);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleFocus');
    const optionsButton = document.getElementById('options');

    chrome.storage.local.get(['focusMode'], function(result) {
      toggleButton.textContent = result.focusMode ? 'Stop Focus' : 'Start Focus';
    });

    toggleButton.addEventListener('click', function() {
      chrome.storage.local.get(['focusMode'], function(result) {
        const newFocusMode = !result.focusMode;
        chrome.storage.local.set({focusMode: newFocusMode}, function() {
          toggleButton.textContent = newFocusMode ? 'Stop Focus' : 'Start Focus';
        });
      });
    });

    optionsButton.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
});

