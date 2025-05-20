let energy = 0;

const energyDisplay = document.getElementById('energyDisplay');
const clickButton = document.getElementById('click-button');

// Apply dark mode by default
document.body.classList.add('dark-mode');

clickButton.addEventListener('click', () => {
    energy++;
    energyDisplay.textContent = energy;
}); 