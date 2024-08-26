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

// Event listener for when the popup DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['focusMode'], function(result) {
        updateToggleButtonText(result.focusMode);
    });

    const toggleButton = document.getElementById('toggleFocus');
    toggleButton.addEventListener('click', toggleFocusMode);
});
