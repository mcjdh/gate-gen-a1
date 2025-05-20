let score = 0;

const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('click-button');

// Apply dark mode by default
document.body.classList.add('dark-mode');

clickButton.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
}); 