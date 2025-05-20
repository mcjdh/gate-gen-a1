let energy = 0;
let energyPerClick = 2;
let clickUpgradeLevel = 0;
let clickUpgradeCost = 5;

// Raspberry Pi Stats
let rpiOwned = 0;
const RPI_BASE_COST = 20;
const RPI_BASE_EPS = 2;
let rpiCurrentCost = RPI_BASE_COST;
let rpiTotalEps = 0;

// Desktop GPU Stats
let desktopOwned = 0;
const DESKTOP_BASE_COST = 150;
const DESKTOP_BASE_EPS = 25;
let desktopCurrentCost = DESKTOP_BASE_COST;
let desktopTotalEps = 0;

let desktopGpuUnlocked = false; // Track if already unlocked

// Mining Rig Stats
let rigOwned = 0;
const RIG_BASE_COST = 1200;
const RIG_BASE_EPS = 200;
let rigCurrentCost = RIG_BASE_COST;
let rigTotalEps = 0;
let miningRigUnlocked = false;

// Small Server Rack Stats
let serverRackOwned = 0;
const SERVER_RACK_BASE_COST = 10000;
const SERVER_RACK_BASE_EPS = 1500;
let serverRackCurrentCost = SERVER_RACK_BASE_COST;
let serverRackTotalEps = 0;
let serverRackUnlocked = false;

// Miniature Fusion Reactor Stats
let fusionReactorOwned = 0;
const FUSION_REACTOR_BASE_COST = 80000;
const FUSION_REACTOR_BASE_EPS = 10000;
let fusionReactorCurrentCost = FUSION_REACTOR_BASE_COST;
let fusionReactorTotalEps = 0;
let fusionReactorUnlocked = false;

// Foundation & Cooling Systems Stats
let foundationCoolingOwned = 0;
const FOUNDATION_COOLING_BASE_COST = 500000;
const FOUNDATION_COOLING_BASE_EPS = 100000;
let foundationCoolingCurrentCost = FOUNDATION_COOLING_BASE_COST;
let foundationCoolingTotalEps = 0;
let foundationCoolingUnlocked = false;

// Tier 1 Server Banks Stats
let serverBanksOwned = 0;
const SERVER_BANKS_BASE_COST = 2000000;
const SERVER_BANKS_BASE_EPS = 500000;
let serverBanksCurrentCost = SERVER_BANKS_BASE_COST;
let serverBanksTotalEps = 0;
let serverBanksUnlocked = false;

// Network Uplink Infrastructure Stats
let networkUplinkOwned = 0;
const NETWORK_UPLINK_BASE_COST = 5000000; // Adjusted from 50000000000
const NETWORK_UPLINK_BASE_EPS = 1000000; // Adjusted from 75000000
let networkUplinkCurrentCost = NETWORK_UPLINK_BASE_COST;
let networkUplinkTotalEps = 0;
let networkUplinkUnlocked = false;

// AI-Powered Gateway Core Stats
let aiCoreOwned = 0;
const AI_CORE_BASE_COST = 10000000; // Adjusted from 250000000000
let aiCoreCurrentCost = AI_CORE_BASE_COST;
let aiCoreUnlocked = false;

let totalEps = 0;
let gameWon = false; // Flag to track win state

// --- LOCALSTORAGE SAVE/LOAD ---
const GAME_SAVE_KEY = 'gatewayGeneratorSave';

// System Log Elements
const systemLogMessages = document.getElementById('system-log-messages');
const MAX_LOG_MESSAGES = 20; // Keep the log from getting too long

function resetGameToDefaults() {
    energy = 0;
    energyPerClick = 2;
    clickUpgradeLevel = 0;
    clickUpgradeCost = 5; 

    rpiOwned = 0;
    rpiCurrentCost = RPI_BASE_COST;

    desktopOwned = 0;
    desktopCurrentCost = DESKTOP_BASE_COST;
    desktopGpuUnlocked = false;

    rigOwned = 0;
    rigCurrentCost = RIG_BASE_COST;
    miningRigUnlocked = false;

    serverRackOwned = 0;
    serverRackCurrentCost = SERVER_RACK_BASE_COST;
    serverRackUnlocked = false;

    fusionReactorOwned = 0;
    fusionReactorCurrentCost = FUSION_REACTOR_BASE_COST;
    fusionReactorUnlocked = false;

    foundationCoolingOwned = 0;
    foundationCoolingCurrentCost = FOUNDATION_COOLING_BASE_COST;
    foundationCoolingUnlocked = false;

    serverBanksOwned = 0;
    serverBanksCurrentCost = SERVER_BANKS_BASE_COST;
    serverBanksUnlocked = false;

    networkUplinkOwned = 0;
    networkUplinkCurrentCost = NETWORK_UPLINK_BASE_COST;
    networkUplinkUnlocked = false;

    aiCoreOwned = 0;
    aiCoreCurrentCost = AI_CORE_BASE_COST;
    aiCoreUnlocked = false;

    gameWon = false; // Reset win state
    // Total EPS will be recalculated by calculateAllEps()
    // Individual generator EPS will be zero due to owned counts being zero.
}

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

            if (savedState.gameWon === true) {
                localStorage.removeItem(GAME_SAVE_KEY); // Clear the won game save
                resetGameToDefaults(); // Reset to default values
                calculateAllEps(); // Recalculate EPS based on defaults
                updateDisplays();   // Update UI based on defaults
                addLogMessage("Previous Gateway construction complete. System reset for new cycle.", "milestone");
                // The initial "System rebooted..." message will still be added below.
            } else {
                // Load game state as usual if not won, or if gameWon flag is missing (older save)
                energy = savedState.energy !== undefined ? savedState.energy : 0;
                energyPerClick = savedState.energyPerClick !== undefined ? savedState.energyPerClick : 2;
                clickUpgradeLevel = savedState.clickUpgradeLevel !== undefined ? savedState.clickUpgradeLevel : 0;
                clickUpgradeCost = savedState.clickUpgradeCost !== undefined ? savedState.clickUpgradeCost : 5;

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
                gameWon = savedState.gameWon !== undefined ? savedState.gameWon : false; // Should be false here
                
                console.log("Game loaded!");
            }
        } catch (e) {
            console.error("Error loading game state:", e);
            // If parsing fails, start a fresh game or use defaults
        }
    }
    calculateAllEps(); // Recalculate EPS after loading
    updateDisplays();   // Update UI after loading
    addLogMessage("System rebooted. Gateway Generator interface online.", "info");
    if (gameWon) {
        addLogMessage("Datacenter Core status: COMPLETE. Standby mode.", "milestone");
    } else if (aiCoreUnlocked) {
        addLogMessage("AI Core construction protocols available.", "unlock");
    } else if (networkUplinkUnlocked) {
        addLogMessage("Network Uplink awaiting deployment.", "unlock");
    } else if (serverBanksUnlocked) {
        addLogMessage("Server Bank installation authorized.", "unlock");
    } else if (foundationCoolingUnlocked) {
        addLogMessage("Datacenter Foundation schematics available.", "unlock");
    } else if (fusionReactorUnlocked) {
        addLogMessage("Fusion Reactor blueprints accessible.", "unlock");
    } else if (serverRackUnlocked) {
        addLogMessage("Server Rack assembly instructions found.", "unlock");
    } else if (miningRigUnlocked) {
        addLogMessage("Mining Rig fabrication plans available.", "unlock");
    } else if (desktopGpuUnlocked) {
        addLogMessage("Desktop GPU schematics acquired.", "unlock");
    }
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

// --- SYSTEM LOG FUNCTIONALITY ---
function addLogMessage(message, type = 'info') {
    if (!systemLogMessages) return; // Guard if element not found

    const isScrolledToBottom = systemLogMessages.scrollHeight - systemLogMessages.clientHeight <= systemLogMessages.scrollTop + 1;

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('log-message');
    if (type) {
        messageElement.classList.add(type);
    }

    // Add new message to the top (because of flex-direction: column-reverse)
    systemLogMessages.appendChild(messageElement);

    // Remove old messages if log exceeds max length
    while (systemLogMessages.children.length > MAX_LOG_MESSAGES) {
        systemLogMessages.removeChild(systemLogMessages.firstChild); // remove from the bottom (visually top)
    }

    // Smart scroll
    if (isScrolledToBottom) {
        systemLogMessages.scrollTop = systemLogMessages.scrollHeight; 
    }
}

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
    } else if (energy >= 100 || rpiOwned >= 3) {
        desktopGpuUpgradeSection.style.display = "block";
        desktopGpuUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Desktop GPU processing unlocked. Enhanced computation available.", "unlock");
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
    } else if (energy >= 800 || desktopOwned >= 3) {
        miningRigUpgradeSection.style.display = "block";
        miningRigUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Mining Rig fabrication plans discovered. Increased output potential.", "unlock");
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
    } else if (energy >= 7000 || rigOwned >= 3) {
        serverRackUpgradeSection.style.display = "block";
        serverRackUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Small Server Rack assembly unlocked. Network capacity growing.", "unlock");
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
    } else if (energy >= 60000 || serverRackOwned >= 2) {
        fusionReactorUpgradeSection.style.display = "block";
        fusionReactorUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Miniature Fusion Reactor unlocked. Significant power increase detected.", "unlock");
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
    if (foundationCoolingOwned > 0) {
        foundationCoolingUpgradeSection.style.display = "block";
        foundationCoolingUpgradeSection.classList.remove('locked-upgrade', 'newly-unlocked');
        buyFoundationCoolingButton.disabled = true;
        buyFoundationCoolingButton.textContent = "Purchased";
    } else if (fusionReactorUnlocked) { // Show as locked once Fusion Reactor is unlocked
        foundationCoolingUpgradeSection.style.display = "block";
        if (foundationCoolingUnlocked) { // Is fully unlocked
            foundationCoolingUpgradeSection.classList.remove('locked-upgrade');
            buyFoundationCoolingButton.disabled = energy < foundationCoolingCurrentCost;
            // newly-unlocked animation is handled below if it just became unlocked
        } else { // Not fully unlocked yet, show as locked
            foundationCoolingUpgradeSection.classList.add('locked-upgrade');
            buyFoundationCoolingButton.disabled = true; // Button within locked-upgrade is also styled by CSS
        }

        // Check for actual unlock condition if not already unlocked
        if (!foundationCoolingUnlocked && (energy >= 400000 || fusionReactorOwned >= 1)) {
            foundationCoolingUnlocked = true;
            foundationCoolingUpgradeSection.classList.remove('locked-upgrade');
            foundationCoolingUpgradeSection.classList.add('newly-unlocked');
            addLogMessage("Datacenter: Foundation & Cooling Systems blueprints decrypted. Construction possible.", "milestone");
            setTimeout(() => {
                foundationCoolingUpgradeSection.classList.remove('newly-unlocked');
            }, 2000);
            // Update button state again in case it just unlocked
            buyFoundationCoolingButton.disabled = energy < foundationCoolingCurrentCost;
        }
    } else {
        foundationCoolingUpgradeSection.style.display = "none"; // Hide if fusion reactor not even unlocked
    }
    // Update text content regardless of lock state if visible
    if (foundationCoolingUpgradeSection.style.display === "block") {
        foundationCoolingOwnedDisplay.textContent = foundationCoolingOwned;
        foundationCoolingEpsDisplay.textContent = foundationCoolingTotalEps;
        foundationCoolingCostDisplay.textContent = foundationCoolingCurrentCost;
        // Button text for purchased state is handled above
        if (foundationCoolingOwned === 0) {
             buyFoundationCoolingButton.textContent = `Buy: ${foundationCoolingCurrentCost} ⚡️`;
        }
    }

    // Tier 1 Server Banks - Unlock Logic
    if (serverBanksOwned > 0) {
        serverBanksUpgradeSection.style.display = "block";
        serverBanksUpgradeSection.classList.remove('locked-upgrade', 'newly-unlocked');
        buyServerBanksButton.disabled = true;
        buyServerBanksButton.textContent = "Purchased";
    } else if (foundationCoolingOwned >= 1) { // Show as locked once Foundation is built
        serverBanksUpgradeSection.style.display = "block";
        if (serverBanksUnlocked) {
            serverBanksUpgradeSection.classList.remove('locked-upgrade');
            buyServerBanksButton.disabled = energy < serverBanksCurrentCost;
        } else {
            serverBanksUpgradeSection.classList.add('locked-upgrade');
            buyServerBanksButton.disabled = true;
        }

        if (!serverBanksUnlocked && (foundationCoolingOwned >= 1 && energy >= 1500000)) {
            serverBanksUnlocked = true;
            serverBanksUpgradeSection.classList.remove('locked-upgrade');
            serverBanksUpgradeSection.classList.add('newly-unlocked');
            addLogMessage("Datacenter: Tier 1 Server Banks available for installation.", "milestone");
            setTimeout(() => {
                serverBanksUpgradeSection.classList.remove('newly-unlocked');
            }, 2000);
            buyServerBanksButton.disabled = energy < serverBanksCurrentCost;
        }
    } else {
        serverBanksUpgradeSection.style.display = "none";
    }
    if (serverBanksUpgradeSection.style.display === "block") {
        serverBanksOwnedDisplay.textContent = serverBanksOwned;
        serverBanksEpsDisplay.textContent = serverBanksTotalEps;
        serverBanksCostDisplay.textContent = serverBanksCurrentCost;
        if (serverBanksOwned === 0) {
            buyServerBanksButton.textContent = `Buy: ${serverBanksCurrentCost} ⚡️`;
        }
    }

    // Network Uplink Infrastructure - Unlock Logic
    if (networkUplinkOwned > 0) {
        networkUplinkUpgradeSection.style.display = "block";
        networkUplinkUpgradeSection.classList.remove('locked-upgrade', 'newly-unlocked');
        buyNetworkUplinkButton.disabled = true;
        buyNetworkUplinkButton.textContent = "Purchased";
    } else if (serverBanksOwned >= 1) { // Show as locked once Server Banks are built
        networkUplinkUpgradeSection.style.display = "block";
        if (networkUplinkUnlocked) {
            networkUplinkUpgradeSection.classList.remove('locked-upgrade');
            buyNetworkUplinkButton.disabled = energy < networkUplinkCurrentCost || gameWon;
        } else {
            networkUplinkUpgradeSection.classList.add('locked-upgrade');
            buyNetworkUplinkButton.disabled = true;
        }

        if (!networkUplinkUnlocked && (serverBanksOwned >= 1 && energy >= 4000000)) {
            networkUplinkUnlocked = true;
            networkUplinkUpgradeSection.classList.remove('locked-upgrade');
            networkUplinkUpgradeSection.classList.add('newly-unlocked');
            addLogMessage("Datacenter: Network Uplink Infrastructure ready for deployment.", "milestone");
            setTimeout(() => {
                networkUplinkUpgradeSection.classList.remove('newly-unlocked');
            }, 2000);
            buyNetworkUplinkButton.disabled = energy < networkUplinkCurrentCost || gameWon;
        }
    } else {
        networkUplinkUpgradeSection.style.display = "none";
    }
    if (networkUplinkUpgradeSection.style.display === "block") {
        networkUplinkOwnedDisplay.textContent = networkUplinkOwned;
        networkUplinkEpsDisplay.textContent = networkUplinkTotalEps;
        networkUplinkCostDisplay.textContent = networkUplinkCurrentCost;
        if (networkUplinkOwned === 0) {
             buyNetworkUplinkButton.textContent = `Buy: ${networkUplinkCurrentCost} ⚡️`;
        }
    }

    // AI-Powered Gateway Core - Unlock Logic
    if (aiCoreOwned > 0) {
        aiCoreUpgradeSection.style.display = "block";
        aiCoreUpgradeSection.classList.remove('locked-upgrade', 'newly-unlocked');
        buyAiCoreButton.disabled = true;
        buyAiCoreButton.textContent = "Datacenter Complete!";
    } else if (networkUplinkOwned >= 1) { // Show as locked once Network Uplink is built
        aiCoreUpgradeSection.style.display = "block";
        if (aiCoreUnlocked) {
            aiCoreUpgradeSection.classList.remove('locked-upgrade');
            buyAiCoreButton.disabled = energy < aiCoreCurrentCost || gameWon;
        } else {
            aiCoreUpgradeSection.classList.add('locked-upgrade');
            buyAiCoreButton.disabled = true;
        }

        if (!aiCoreUnlocked && (networkUplinkOwned >= 1 && energy >= 8000000)) {
            aiCoreUnlocked = true;
            aiCoreUpgradeSection.classList.remove('locked-upgrade');
            aiCoreUpgradeSection.classList.add('newly-unlocked');
            addLogMessage("Datacenter: AI-Powered Gateway Core construction protocols available. Final assembly imminent.", "milestone");
            setTimeout(() => {
                aiCoreUpgradeSection.classList.remove('newly-unlocked');
            }, 2000);
            buyAiCoreButton.disabled = energy < aiCoreCurrentCost || gameWon;
        }
    } else {
        aiCoreUpgradeSection.style.display = "none";
    }
    if (aiCoreUpgradeSection.style.display === "block") {
        aiCoreOwnedDisplay.textContent = aiCoreOwned;
        aiCoreCostDisplay.textContent = aiCoreCurrentCost;
        if (aiCoreOwned === 0) {
             buyAiCoreButton.textContent = `Build: ${aiCoreCurrentCost} ⚡️`;
        }
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
        clickUpgradeCost = Math.floor(5 * Math.pow(1.4, clickUpgradeLevel));
        if (clickUpgradeLevel === 1) {
            addLogMessage("Manual click input amplified. Efficiency increased.", "info");
        } else if (clickUpgradeLevel % 5 === 0) {
             addLogMessage(`Click power reached level ${clickUpgradeLevel}! Neural interface synchronizing...`, "info");
        }
        updateDisplays();
        saveGameState();
    }
});

buyRpiButton.addEventListener('click', () => {
    if (energy >= rpiCurrentCost) {
        energy -= rpiCurrentCost;
        rpiOwned++;
        if (rpiOwned === 1) {
            addLogMessage("First Raspberry Pi online. Automated energy generation initiated.", "unlock");
        } else if (rpiOwned % 10 === 0) {
            addLogMessage(`${rpiOwned} R-Pi units now active. The cluster hums quietly.`, "info");
        }
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
        if (desktopOwned === 1) {
            addLogMessage("First Desktop GPU unit integrated. Parallel processing enhanced.", "info");
        }
        desktopCurrentCost = Math.floor(DESKTOP_BASE_COST * Math.pow(1.18, desktopOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyRigButton.addEventListener('click', () => {
    if (energy >= rigCurrentCost) {
        energy -= rigCurrentCost;
        rigOwned++;
        if (rigOwned === 1) {
            addLogMessage("First Mining Rig constructed. Energy output significantly boosted.", "info");
        }
        rigCurrentCost = Math.floor(RIG_BASE_COST * Math.pow(1.22, rigOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyServerRackButton.addEventListener('click', () => {
    if (energy >= serverRackCurrentCost) {
        energy -= serverRackCurrentCost;
        serverRackOwned++;
        if (serverRackOwned === 1) {
            addLogMessage("First Server Rack installed. Datastream capacity nominal.", "info");
        }
        serverRackCurrentCost = Math.floor(SERVER_RACK_BASE_COST * Math.pow(1.28, serverRackOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyFusionReactorButton.addEventListener('click', () => {
    if (energy >= fusionReactorCurrentCost) {
        energy -= fusionReactorCurrentCost;
        fusionReactorOwned++;
        if (fusionReactorOwned === 1) {
            addLogMessage("Miniature Fusion Reactor activated. Power levels surging.", "milestone");
            addLogMessage("High energy output detected. Preliminary schematics for 'Project Gateway' accessible. Advanced datacenter research viable...", "lore");
        }
        fusionReactorCurrentCost = Math.floor(FUSION_REACTOR_BASE_COST * Math.pow(1.30, fusionReactorOwned));
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

// Buy Foundation & Cooling Systems Event Listener
buyFoundationCoolingButton.addEventListener('click', () => {
    if (energy >= foundationCoolingCurrentCost && foundationCoolingOwned === 0) { // Ensure it can only be bought once
        energy -= foundationCoolingCurrentCost;
        foundationCoolingOwned++;
        addLogMessage("Datacenter Component: Foundation & Cooling - INSTALLED. Core temperature stabilized. Main server bank integration now feasible.", "milestone");
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
    if (energy >= serverBanksCurrentCost && serverBanksOwned === 0) { // Ensure it can only be bought once
        energy -= serverBanksCurrentCost;
        serverBanksOwned++;
        addLogMessage("Datacenter Component: Tier 1 Server Banks - ONLINE. Computational capacity nominal. Next phase: establishing wide-band network uplink.", "milestone");
        calculateAllEps();
        updateDisplays();
        saveGameState();
        buyServerBanksButton.disabled = true;
        buyServerBanksButton.textContent = "Purchased";
    }
});

// Buy Network Uplink Infrastructure Event Listener
buyNetworkUplinkButton.addEventListener('click', () => {
    if (energy >= networkUplinkCurrentCost && networkUplinkOwned === 0) { // Ensure it can only be bought once
        energy -= networkUplinkCurrentCost;
        networkUplinkOwned++;
        addLogMessage("Datacenter Component: Network Uplink Infrastructure - ESTABLISHED. Global data conduit active. Final objective: AI Gateway Core deployment.", "milestone");
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
    addLogMessage("AI GATEWAY CORE ACTIVATED. ALL SYSTEMS PEAK. THE GATEWAY IS OPEN.", "lore");
    addLogMessage("Energy generation nominal. Purpose fulfilled... or has it just begun?", "lore");
    // Display win message
    setTimeout(() => { // Timeout to allow UI to update first
        alert("The Gateway is Online.\n\nThe AI Core resonates with cosmic energy, the Datacenter a triumph of will and intellect. You have unlocked a connection to something vast, something unknown. The universe holds its breath.\n\nWhat will you do with this power?\n\nGateway Generator complete. The journey has just begun...\n\n(You can refresh to start over.)");
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