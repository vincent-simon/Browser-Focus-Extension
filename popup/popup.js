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
