let energy = 0;
let energyPerClick = 2;
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

// Small Server Rack Stats
let serverRackOwned = 0;
const SERVER_RACK_BASE_COST = 300000;
const SERVER_RACK_BASE_EPS = 1200;
let serverRackCurrentCost = SERVER_RACK_BASE_COST;
let serverRackTotalEps = 0;
let serverRackUnlocked = false;

// Miniature Fusion Reactor Stats
let fusionReactorOwned = 0;
const FUSION_REACTOR_BASE_COST = 37500000;
const FUSION_REACTOR_BASE_EPS = 50000;
let fusionReactorCurrentCost = FUSION_REACTOR_BASE_COST;
let fusionReactorTotalEps = 0;
let fusionReactorUnlocked = false;

// Foundation & Cooling Systems Stats
let foundationCoolingOwned = 0;
const FOUNDATION_COOLING_BASE_COST = 1000000000; // 1 Billion
const FOUNDATION_COOLING_BASE_EPS = 1000000; // 1 Million EPS
let foundationCoolingCurrentCost = FOUNDATION_COOLING_BASE_COST;
let foundationCoolingTotalEps = 0;
let foundationCoolingUnlocked = false;

// Tier 1 Server Banks Stats
let serverBanksOwned = 0;
const SERVER_BANKS_BASE_COST = 10000000000; // 10 Billion
const SERVER_BANKS_BASE_EPS = 15000000; // 15 Million EPS
let serverBanksCurrentCost = SERVER_BANKS_BASE_COST;
let serverBanksTotalEps = 0;
let serverBanksUnlocked = false;

// Network Uplink Infrastructure Stats
let networkUplinkOwned = 0;
const NETWORK_UPLINK_BASE_COST = 50000000000; // 50 Billion
const NETWORK_UPLINK_BASE_EPS = 75000000; // 75 Million EPS
let networkUplinkCurrentCost = NETWORK_UPLINK_BASE_COST;
let networkUplinkTotalEps = 0;
let networkUplinkUnlocked = false;

// AI-Powered Gateway Core Stats
let aiCoreOwned = 0;
const AI_CORE_BASE_COST = 250000000000; // 250 Billion
let aiCoreCurrentCost = AI_CORE_BASE_COST;
let aiCoreUnlocked = false;

let totalEps = 0;
let gameWon = false; // Flag to track win state

// --- LOCALSTORAGE SAVE/LOAD ---
const GAME_SAVE_KEY = 'gatewayGeneratorSave';

function saveGameState() {
    const gameState = {
        energy,
        energyPerClick,
        clickUpgradeLevel,
        clickUpgradeCost,
        rpiOwned,
        rpiCurrentCost,
        desktopOwned,
        desktopCurrentCost,
        desktopGpuUnlocked,
        rigOwned,
        rigCurrentCost,
        miningRigUnlocked,
        serverRackOwned,
        serverRackCurrentCost,
        serverRackUnlocked,
        fusionReactorOwned,
        fusionReactorCurrentCost,
        fusionReactorUnlocked,
        foundationCoolingOwned,
        foundationCoolingCurrentCost,
        foundationCoolingUnlocked,
        serverBanksOwned,
        serverBanksCurrentCost,
        serverBanksUnlocked,
        networkUplinkOwned,
        networkUplinkCurrentCost,
        networkUplinkUnlocked,
        aiCoreOwned,
        aiCoreCurrentCost,
        aiCoreUnlocked,
        gameWon,
        // Note: Base costs and base EPS are constants, no need to save.
        // Total EPS is calculated, no need to save.
    };
    try {
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(gameState));
        console.log("Game saved!");
    } catch (e) {
        console.error("Error saving game state:", e);
    }
}

function loadGameState() {
    const savedStateJSON = localStorage.getItem(GAME_SAVE_KEY);
    if (savedStateJSON) {
        try {
            const savedState = JSON.parse(savedStateJSON);

            energy = savedState.energy !== undefined ? savedState.energy : 0;
            energyPerClick = savedState.energyPerClick !== undefined ? savedState.energyPerClick : 2;
            clickUpgradeLevel = savedState.clickUpgradeLevel !== undefined ? savedState.clickUpgradeLevel : 0;
            clickUpgradeCost = savedState.clickUpgradeCost !== undefined ? savedState.clickUpgradeCost : 10;

            rpiOwned = savedState.rpiOwned !== undefined ? savedState.rpiOwned : 0;
            rpiCurrentCost = savedState.rpiCurrentCost !== undefined ? savedState.rpiCurrentCost : RPI_BASE_COST;

            desktopOwned = savedState.desktopOwned !== undefined ? savedState.desktopOwned : 0;
            desktopCurrentCost = savedState.desktopCurrentCost !== undefined ? savedState.desktopCurrentCost : DESKTOP_BASE_COST;
            desktopGpuUnlocked = savedState.desktopGpuUnlocked !== undefined ? savedState.desktopGpuUnlocked : false;

            rigOwned = savedState.rigOwned !== undefined ? savedState.rigOwned : 0;
            rigCurrentCost = savedState.rigCurrentCost !== undefined ? savedState.rigCurrentCost : RIG_BASE_COST;
            miningRigUnlocked = savedState.miningRigUnlocked !== undefined ? savedState.miningRigUnlocked : false;

            serverRackOwned = savedState.serverRackOwned !== undefined ? savedState.serverRackOwned : 0;
            serverRackCurrentCost = savedState.serverRackCurrentCost !== undefined ? savedState.serverRackCurrentCost : SERVER_RACK_BASE_COST;
            serverRackUnlocked = savedState.serverRackUnlocked !== undefined ? savedState.serverRackUnlocked : false;

            fusionReactorOwned = savedState.fusionReactorOwned !== undefined ? savedState.fusionReactorOwned : 0;
            fusionReactorCurrentCost = savedState.fusionReactorCurrentCost !== undefined ? savedState.fusionReactorCurrentCost : FUSION_REACTOR_BASE_COST;
            fusionReactorUnlocked = savedState.fusionReactorUnlocked !== undefined ? savedState.fusionReactorUnlocked : false;

            foundationCoolingOwned = savedState.foundationCoolingOwned !== undefined ? savedState.foundationCoolingOwned : 0;
            foundationCoolingCurrentCost = savedState.foundationCoolingCurrentCost !== undefined ? savedState.foundationCoolingCurrentCost : FOUNDATION_COOLING_BASE_COST;
            foundationCoolingUnlocked = savedState.foundationCoolingUnlocked !== undefined ? savedState.foundationCoolingUnlocked : false;

            serverBanksOwned = savedState.serverBanksOwned !== undefined ? savedState.serverBanksOwned : 0;
            serverBanksCurrentCost = savedState.serverBanksCurrentCost !== undefined ? savedState.serverBanksCurrentCost : SERVER_BANKS_BASE_COST;
            serverBanksUnlocked = savedState.serverBanksUnlocked !== undefined ? savedState.serverBanksUnlocked : false;

            networkUplinkOwned = savedState.networkUplinkOwned !== undefined ? savedState.networkUplinkOwned : 0;
            networkUplinkCurrentCost = savedState.networkUplinkCurrentCost !== undefined ? savedState.networkUplinkCurrentCost : NETWORK_UPLINK_BASE_COST;
            networkUplinkUnlocked = savedState.networkUplinkUnlocked !== undefined ? savedState.networkUplinkUnlocked : false;

            aiCoreOwned = savedState.aiCoreOwned !== undefined ? savedState.aiCoreOwned : 0;
            aiCoreCurrentCost = savedState.aiCoreCurrentCost !== undefined ? savedState.aiCoreCurrentCost : AI_CORE_BASE_COST;
            aiCoreUnlocked = savedState.aiCoreUnlocked !== undefined ? savedState.aiCoreUnlocked : false;
            gameWon = savedState.gameWon !== undefined ? savedState.gameWon : false;
            
            console.log("Game loaded!");
        } catch (e) {
            console.error("Error loading game state:", e);
            // If parsing fails, start a fresh game or use defaults
        }
    }
    calculateAllEps(); // Recalculate EPS after loading
    updateDisplays();   // Update UI after loading
}

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

// Small Server Rack Elements
const serverRackUpgradeSection = document.getElementById('server-rack-upgrade-section');
const serverRackOwnedDisplay = document.getElementById('serverRackOwnedDisplay');
const serverRackEpsDisplay = document.getElementById('serverRackEpsDisplay');
const serverRackCostDisplay = document.getElementById('serverRackCostDisplay');
const buyServerRackButton = document.getElementById('buy-server-rack');

// Miniature Fusion Reactor Elements
const fusionReactorUpgradeSection = document.getElementById('fusion-reactor-upgrade-section');
const fusionReactorOwnedDisplay = document.getElementById('fusionReactorOwnedDisplay');
const fusionReactorEpsDisplay = document.getElementById('fusionReactorEpsDisplay');
const fusionReactorCostDisplay = document.getElementById('fusionReactorCostDisplay');
const buyFusionReactorButton = document.getElementById('buy-fusion-reactor');

// Foundation & Cooling Systems Elements
const foundationCoolingUpgradeSection = document.getElementById('foundation-cooling-upgrade-section');
const foundationCoolingOwnedDisplay = document.getElementById('foundationCoolingOwnedDisplay');
const foundationCoolingEpsDisplay = document.getElementById('foundationCoolingEpsDisplay');
const foundationCoolingCostDisplay = document.getElementById('foundationCoolingCostDisplay');
const buyFoundationCoolingButton = document.getElementById('buy-foundation-cooling');

// Tier 1 Server Banks Elements
const serverBanksUpgradeSection = document.getElementById('server-banks-upgrade-section');
const serverBanksOwnedDisplay = document.getElementById('serverBanksOwnedDisplay');
const serverBanksEpsDisplay = document.getElementById('serverBanksEpsDisplay');
const serverBanksCostDisplay = document.getElementById('serverBanksCostDisplay');
const buyServerBanksButton = document.getElementById('buy-server-banks');

// Network Uplink Infrastructure Elements
const networkUplinkUpgradeSection = document.getElementById('network-uplink-upgrade-section');
const networkUplinkOwnedDisplay = document.getElementById('networkUplinkOwnedDisplay');
const networkUplinkEpsDisplay = document.getElementById('networkUplinkEpsDisplay');
const networkUplinkCostDisplay = document.getElementById('networkUplinkCostDisplay');
const buyNetworkUplinkButton = document.getElementById('buy-network-uplink');

// AI-Powered Gateway Core Elements
const aiCoreUpgradeSection = document.getElementById('ai-core-upgrade-section');
const aiCoreOwnedDisplay = document.getElementById('aiCoreOwnedDisplay');
const aiCoreCostDisplay = document.getElementById('aiCoreCostDisplay');
const buyAiCoreButton = document.getElementById('buy-ai-core');

// Apply dark mode by default
document.body.classList.add('dark-mode');

function calculateAllEps() {
    rpiTotalEps = rpiOwned * RPI_BASE_EPS;
    desktopTotalEps = desktopOwned * DESKTOP_BASE_EPS;
    rigTotalEps = rigOwned * RIG_BASE_EPS;
    serverRackTotalEps = serverRackOwned * SERVER_RACK_BASE_EPS;
    fusionReactorTotalEps = fusionReactorOwned * FUSION_REACTOR_BASE_EPS;
    foundationCoolingTotalEps = foundationCoolingOwned * FOUNDATION_COOLING_BASE_EPS;
    serverBanksTotalEps = serverBanksOwned * SERVER_BANKS_BASE_EPS;
    networkUplinkTotalEps = networkUplinkOwned * NETWORK_UPLINK_BASE_EPS;
    totalEps = rpiTotalEps + desktopTotalEps + rigTotalEps + serverRackTotalEps + fusionReactorTotalEps + foundationCoolingTotalEps + serverBanksTotalEps + networkUplinkTotalEps;
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

    // Small Server Rack - Unlock Logic
    if (serverRackUnlocked) {
        serverRackUpgradeSection.style.display = "block";
    } else if (energy >= 200000 || rigOwned >= 5) {
        serverRackUpgradeSection.style.display = "block";
        serverRackUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            serverRackUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        serverRackUnlocked = true;
    } else {
        serverRackUpgradeSection.style.display = "none";
    }
    // Update Small Server Rack displays if section is visible
    if (serverRackUpgradeSection.style.display === "block") {
        serverRackOwnedDisplay.textContent = serverRackOwned;
        serverRackEpsDisplay.textContent = serverRackTotalEps;
        serverRackCostDisplay.textContent = serverRackCurrentCost;
        buyServerRackButton.disabled = energy < serverRackCurrentCost;
    }

    // Miniature Fusion Reactor - Unlock Logic
    if (fusionReactorUnlocked) {
        fusionReactorUpgradeSection.style.display = "block";
    } else if (energy >= 50000000 || serverRackOwned >= 5) {
        fusionReactorUpgradeSection.style.display = "block";
        fusionReactorUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            fusionReactorUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        fusionReactorUnlocked = true;
    } else {
        fusionReactorUpgradeSection.style.display = "none";
    }
    // Update Miniature Fusion Reactor displays if section is visible
    if (fusionReactorUpgradeSection.style.display === "block") {
        fusionReactorOwnedDisplay.textContent = fusionReactorOwned;
        fusionReactorEpsDisplay.textContent = fusionReactorTotalEps;
        fusionReactorCostDisplay.textContent = fusionReactorCurrentCost;
        buyFusionReactorButton.disabled = energy < fusionReactorCurrentCost;
    }

    // Foundation & Cooling Systems - Unlock Logic
    if (foundationCoolingUnlocked) {
        foundationCoolingUpgradeSection.style.display = "block";
    } else if (energy >= 500000000 || fusionReactorOwned >= 1) { // Unlock at 500M energy or 1 Fusion Reactor
        foundationCoolingUpgradeSection.style.display = "block";
        foundationCoolingUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            foundationCoolingUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        foundationCoolingUnlocked = true;
    } else {
        foundationCoolingUpgradeSection.style.display = "none";
    }
    // Update Foundation & Cooling Systems displays if section is visible
    if (foundationCoolingUpgradeSection.style.display === "block") {
        foundationCoolingOwnedDisplay.textContent = foundationCoolingOwned;
        foundationCoolingEpsDisplay.textContent = foundationCoolingTotalEps;
        foundationCoolingCostDisplay.textContent = foundationCoolingCurrentCost;
        buyFoundationCoolingButton.disabled = energy < foundationCoolingCurrentCost || foundationCoolingOwned > 0;
        if(foundationCoolingOwned > 0) buyFoundationCoolingButton.textContent = "Purchased";
    }

    // Tier 1 Server Banks - Unlock Logic
    if (serverBanksUnlocked) {
        serverBanksUpgradeSection.style.display = "block";
    } else if (foundationCoolingOwned >= 1 && energy >= 5000000000) { // Unlock when Foundation is built and player has 5B energy
        serverBanksUpgradeSection.style.display = "block";
        serverBanksUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            serverBanksUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        serverBanksUnlocked = true;
    } else {
        serverBanksUpgradeSection.style.display = "none";
    }
    // Update Tier 1 Server Banks displays if section is visible
    if (serverBanksUpgradeSection.style.display === "block") {
        serverBanksOwnedDisplay.textContent = serverBanksOwned;
        serverBanksEpsDisplay.textContent = serverBanksTotalEps;
        serverBanksCostDisplay.textContent = serverBanksCurrentCost;
        buyServerBanksButton.disabled = energy < serverBanksCurrentCost || serverBanksOwned > 0;
        if(serverBanksOwned > 0) buyServerBanksButton.textContent = "Purchased";
    }

    // Network Uplink Infrastructure - Unlock Logic
    if (networkUplinkUnlocked) {
        networkUplinkUpgradeSection.style.display = "block";
    } else if (serverBanksOwned >= 1 && energy >= 25000000000) { // Unlock when Server Banks are built and player has 25B energy
        networkUplinkUpgradeSection.style.display = "block";
        networkUplinkUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            networkUplinkUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        networkUplinkUnlocked = true;
    } else {
        networkUplinkUpgradeSection.style.display = "none";
    }
    // Update Network Uplink Infrastructure displays if section is visible
    if (networkUplinkUpgradeSection.style.display === "block") {
        networkUplinkOwnedDisplay.textContent = networkUplinkOwned;
        networkUplinkEpsDisplay.textContent = networkUplinkTotalEps;
        networkUplinkCostDisplay.textContent = networkUplinkCurrentCost;
        buyNetworkUplinkButton.disabled = energy < networkUplinkCurrentCost || networkUplinkOwned > 0 || gameWon;
        if(networkUplinkOwned > 0) buyNetworkUplinkButton.textContent = "Purchased";
    }

    // AI-Powered Gateway Core - Unlock Logic
    if (aiCoreUnlocked) {
        aiCoreUpgradeSection.style.display = "block";
    } else if (networkUplinkOwned >= 1 && energy >= 100000000000) { // Unlock when Network Uplink is built and player has 100B energy
        aiCoreUpgradeSection.style.display = "block";
        aiCoreUpgradeSection.classList.add('newly-unlocked');
        setTimeout(() => {
            aiCoreUpgradeSection.classList.remove('newly-unlocked');
        }, 2000);
        aiCoreUnlocked = true;
    } else {
        aiCoreUpgradeSection.style.display = "none";
    }
    // Update AI-Powered Gateway Core displays if section is visible
    if (aiCoreUpgradeSection.style.display === "block") {
        aiCoreOwnedDisplay.textContent = aiCoreOwned;
        aiCoreCostDisplay.textContent = aiCoreCurrentCost;
        buyAiCoreButton.disabled = energy < aiCoreCurrentCost || aiCoreOwned > 0 || gameWon;
        if(aiCoreOwned > 0) buyAiCoreButton.textContent = "Datacenter Complete!";
    }

    // Disable all buttons if game is won
    if (gameWon) {
        upgradeClickPowerButton.disabled = true;
        buyRpiButton.disabled = true;
        buyDesktopButton.disabled = true;
        buyRigButton.disabled = true;
        buyServerRackButton.disabled = true;
        buyFusionReactorButton.disabled = true;
        buyFoundationCoolingButton.disabled = true;
        buyServerBanksButton.disabled = true;
        buyNetworkUplinkButton.disabled = true;
        buyAiCoreButton.disabled = true;
        clickButton.disabled = true;
    }
}

clickButton.addEventListener('click', () => {
    energy += energyPerClick;
    updateDisplays();

    // Add click animation
    clickButton.classList.add('clicked');
    setTimeout(() => {
        clickButton.classList.remove('clicked');
    }, 100); // Duration of the transform transition
});

upgradeClickPowerButton.addEventListener('click', () => {
    if (energy >= clickUpgradeCost) {
        energy -= clickUpgradeCost;
        clickUpgradeLevel++;
        energyPerClick++;
        clickUpgradeCost = Math.floor(10 * Math.pow(1.5, clickUpgradeLevel));
        updateDisplays();
        saveGameState();
    }
});

buyRpiButton.addEventListener('click', () => {
    if (energy >= rpiCurrentCost) {
        energy -= rpiCurrentCost;
        rpiOwned++;
        rpiCurrentCost = Math.floor(RPI_BASE_COST * Math.pow(1.15, rpiOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyDesktopButton.addEventListener('click', () => {
    if (energy >= desktopCurrentCost) {
        energy -= desktopCurrentCost;
        desktopOwned++;
        desktopCurrentCost = Math.floor(DESKTOP_BASE_COST * Math.pow(1.20, desktopOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyRigButton.addEventListener('click', () => {
    if (energy >= rigCurrentCost) {
        energy -= rigCurrentCost;
        rigOwned++;
        rigCurrentCost = Math.floor(RIG_BASE_COST * Math.pow(1.25, rigOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyServerRackButton.addEventListener('click', () => {
    if (energy >= serverRackCurrentCost) {
        energy -= serverRackCurrentCost;
        serverRackOwned++;
        serverRackCurrentCost = Math.floor(SERVER_RACK_BASE_COST * Math.pow(1.30, serverRackOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyFusionReactorButton.addEventListener('click', () => {
    if (energy >= fusionReactorCurrentCost) {
        energy -= fusionReactorCurrentCost;
        fusionReactorOwned++;
        fusionReactorCurrentCost = Math.floor(FUSION_REACTOR_BASE_COST * Math.pow(1.35, fusionReactorOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

// Buy Foundation & Cooling Systems Event Listener
buyFoundationCoolingButton.addEventListener('click', () => {
    if (energy >= foundationCoolingCurrentCost) {
        energy -= foundationCoolingCurrentCost;
        foundationCoolingOwned++;
        // For now, let's assume it's a unique, one-time purchase, so no cost scaling.
        // If it becomes stackable, add cost scaling like:
        // foundationCoolingCurrentCost = Math.floor(FOUNDATION_COOLING_BASE_COST * Math.pow(1.X, foundationCoolingOwned)); 
        calculateAllEps();
        updateDisplays();
        saveGameState();
        // Since it's a unique component, disable the button after purchase
        buyFoundationCoolingButton.disabled = true; 
        buyFoundationCoolingButton.textContent = "Purchased";
    }
});

// Buy Tier 1 Server Banks Event Listener
buyServerBanksButton.addEventListener('click', () => {
    if (energy >= serverBanksCurrentCost) {
        energy -= serverBanksCurrentCost;
        serverBanksOwned++;
        // Assuming unique, one-time purchase for now
        calculateAllEps();
        updateDisplays();
        saveGameState();
        buyServerBanksButton.disabled = true;
        buyServerBanksButton.textContent = "Purchased";
    }
});

// Buy Network Uplink Infrastructure Event Listener
buyNetworkUplinkButton.addEventListener('click', () => {
    if (energy >= networkUplinkCurrentCost) {
        energy -= networkUplinkCurrentCost;
        networkUplinkOwned++;
        // Assuming unique, one-time purchase for now
        calculateAllEps();
        updateDisplays();
        saveGameState();
        buyNetworkUplinkButton.disabled = true;
        buyNetworkUplinkButton.textContent = "Purchased";
    }
});

// Buy AI-Powered Gateway Core Event Listener
buyAiCoreButton.addEventListener('click', () => {
    if (energy >= aiCoreCurrentCost && !gameWon) {
        energy -= aiCoreCurrentCost;
        aiCoreOwned++;
        // No EPS boost, triggers win condition
        calculateAllEps(); // Recalculate just in case, though AI core adds no EPS
        updateDisplays();
        triggerWinCondition(); // Call the win condition function
        saveGameState(); // Save the win state
    }
});

function triggerWinCondition() {
    gameWon = true;
    updateDisplays(); // Update displays to disable buttons and show win state
    // Display win message
    setTimeout(() => { // Timeout to allow UI to update first
        alert("Congratulations!\n\nYou have successfully built the AI-Powered Gateway Core and completed the Gateway Datacenter!\n\nEnergy generation has reached peak capacity. You have won Gateway Generator!\n\nThanks for playing! You can refresh to start over.");
    }, 100); 
}

// Main Game Loop
function gameLoop() {
    energy += totalEps / 10; // Add a fraction of EPS 10 times per second for smoother display
    updateDisplays();
}

// --- INITIALIZE GAME ---
loadGameState(); // Load game state first
calculateAllEps(); // Then calculate EPS based on loaded values
updateDisplays(); // Then update all displays

setInterval(gameLoop, 100); // Run game loop 10 times per second
setInterval(saveGameState, 30000); // Autosave every 30 seconds
window.addEventListener('beforeunload', saveGameState); // Save before leaving 