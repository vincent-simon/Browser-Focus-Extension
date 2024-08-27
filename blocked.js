// Get elements
const ambience = document.getElementById('ambience');
const toggleSound = document.getElementById('toggle-sound');

// Play the sound by default
let isSoundPlaying = true;
ambience.play();
toggleSound.textContent = '🔊';

// Toggle sound on button click
toggleSound.addEventListener('click', function() {
    if (isSoundPlaying) {
        ambience.pause();
        toggleSound.textContent = '🔇';
    } else {
        ambience.play();
        toggleSound.textContent = '🔊';
    }
    isSoundPlaying = !isSoundPlaying;
});

// Return button functionality
document.getElementById('return-button').addEventListener('click', function() {
    window.history.back();
});
