let energy = 0;
let energyPerClick = 1;
let clickUpgradeLevel = 0;
let clickUpgradeCost = 10;

// Raspberry Pi Stats
let rpiOwned = 0;
const RPI_BASE_COST = 100;
const RPI_BASE_EPS = 1;
let rpiCurrentCost = RPI_BASE_COST;
let rpiTotalEps = 0;

// Desktop GPU Stats
let desktopOwned = 0;
const DESKTOP_BASE_COST = 750;
const DESKTOP_BASE_EPS = 10;
let desktopCurrentCost = DESKTOP_BASE_COST;
let desktopTotalEps = 0;

let desktopGpuUnlocked = false; // Track if already unlocked

// Mining Rig Stats
let rigOwned = 0;
const RIG_BASE_COST = 15000;
const RIG_BASE_EPS = 100;
let rigCurrentCost = RIG_BASE_COST;
let rigTotalEps = 0;
let miningRigUnlocked = false;

let totalEps = 0;

const energyDisplay = document.getElementById('energyDisplay');
const energyPerClickDisplay = document.getElementById('energyPerClickDisplay');
const totalEpsDisplay = document.getElementById('totalEpsDisplay'); // New display element
const clickButton = document.getElementById('click-button');

// Click Upgrade Elements
const upgradeClickPowerButton = document.getElementById('upgrade-click-power');
const clickUpgradeCostDisplay = document.getElementById('clickUpgradeCost');
const clickUpgradeLevelDisplay = document.getElementById('clickUpgradeLevel');

// Raspberry Pi Elements
const rpiOwnedDisplay = document.getElementById('rpiOwnedDisplay');
const rpiEpsDisplay = document.getElementById('rpiEpsDisplay');
const rpiCostDisplay = document.getElementById('rpiCostDisplay');
const buyRpiButton = document.getElementById('buy-rpi');

// Desktop GPU Elements
const desktopGpuUpgradeSection = document.getElementById('desktop-gpu-upgrade-section'); // New element
const desktopOwnedDisplay = document.getElementById('desktopOwnedDisplay');
const desktopEpsDisplay = document.getElementById('desktopEpsDisplay');
const desktopCostDisplay = document.getElementById('desktopCostDisplay');
const buyDesktopButton = document.getElementById('buy-desktop');

// Mining Rig Elements
const miningRigUpgradeSection = document.getElementById('mining-rig-upgrade-section');
const rigOwnedDisplay = document.getElementById('rigOwnedDisplay');
const rigEpsDisplay = document.getElementById('rigEpsDisplay');
const rigCostDisplay = document.getElementById('rigCostDisplay');
const buyRigButton = document.getElementById('buy-rig');

// Apply dark mode by default
document.body.classList.add('dark-mode');

function calculateAllEps() {
    rpiTotalEps = rpiOwned * RPI_BASE_EPS;
    desktopTotalEps = desktopOwned * DESKTOP_BASE_EPS;
    rigTotalEps = rigOwned * RIG_BASE_EPS;
    totalEps = rpiTotalEps + desktopTotalEps + rigTotalEps;
}

function updateDisplays() {
    energyDisplay.textContent = Math.floor(energy);
    energyPerClickDisplay.textContent = energyPerClick;
    totalEpsDisplay.textContent = totalEps;

    clickUpgradeCostDisplay.textContent = clickUpgradeCost;
    clickUpgradeLevelDisplay.textContent = clickUpgradeLevel;
    upgradeClickPowerButton.disabled = energy < clickUpgradeCost;

    rpiOwnedDisplay.textContent = rpiOwned;
    rpiEpsDisplay.textContent = rpiTotalEps;
    rpiCostDisplay.textContent = rpiCurrentCost;
    buyRpiButton.disabled = energy < rpiCurrentCost;

    // Desktop GPU - Unlock Logic Refined
    if (desktopGpuUnlocked) {
        desktopGpuUpgradeSection.style.display = "block";
    } else if (energy >= 500 || rpiOwned >= 5) {
        desktopGpuUpgradeSection.style.display = "block";
        desktopGpuUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            desktopGpuUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        desktopGpuUnlocked = true;
    } else {
        desktopGpuUpgradeSection.style.display = "none";
    }
    // Update Desktop GPU displays if section is visible
    if (desktopGpuUpgradeSection.style.display === "block") {
        desktopOwnedDisplay.textContent = desktopOwned;
        desktopEpsDisplay.textContent = desktopTotalEps;
        desktopCostDisplay.textContent = desktopCurrentCost;
        buyDesktopButton.disabled = energy < desktopCurrentCost;
    }

    // Mining Rig - Unlock Logic Refined
    if (miningRigUnlocked) {
        miningRigUpgradeSection.style.display = "block";
    } else if (energy >= 10000 || desktopOwned >= 5) {
        miningRigUpgradeSection.style.display = "block";
        miningRigUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            miningRigUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        miningRigUnlocked = true;
    } else {
        miningRigUpgradeSection.style.display = "none";
    }
    // Update Mining Rig displays if section is visible
    if (miningRigUpgradeSection.style.display === "block") {
        rigOwnedDisplay.textContent = rigOwned;
        rigEpsDisplay.textContent = rigTotalEps;
        rigCostDisplay.textContent = rigCurrentCost;
        buyRigButton.disabled = energy < rigCurrentCost;
    }
}

clickButton.addEventListener('click', () => {
    energy += energyPerClick;
    updateDisplays();
});

upgradeClickPowerButton.addEventListener('click', () => {
    if (energy >= clickUpgradeCost) {
        energy -= clickUpgradeCost;
        clickUpgradeLevel++;
        energyPerClick++;
        clickUpgradeCost = Math.floor(10 * Math.pow(1.5, clickUpgradeLevel));
        updateDisplays();
    }
});

buyRpiButton.addEventListener('click', () => {
    if (energy >= rpiCurrentCost) {
        energy -= rpiCurrentCost;
        rpiOwned++;
        rpiCurrentCost = Math.floor(RPI_BASE_COST * Math.pow(1.15, rpiOwned));
        calculateAllEps();
        updateDisplays();
    }
});

buyDesktopButton.addEventListener('click', () => {
    if (energy >= desktopCurrentCost) {
        energy -= desktopCurrentCost;
        desktopOwned++;
        desktopCurrentCost = Math.floor(DESKTOP_BASE_COST * Math.pow(1.20, desktopOwned));
        calculateAllEps();
        updateDisplays();
    }
});

buyRigButton.addEventListener('click', () => {
    if (energy >= rigCurrentCost) {
        energy -= rigCurrentCost;
        rigOwned++;
        rigCurrentCost = Math.floor(RIG_BASE_COST * Math.pow(1.25, rigOwned));
        calculateAllEps();
        updateDisplays();
    }
});

// Main Game Loop
function gameLoop() {
    energy += totalEps / 10; // Add a fraction of EPS 10 times per second for smoother display
    updateDisplays();
}

calculateAllEps();
// Set initial display state for unlockable sections
desktopGpuUpgradeSection.style.display = "none";
miningRigUpgradeSection.style.display = "none";
updateDisplays();
setInterval(gameLoop, 100); // Run game loop 10 times per second 