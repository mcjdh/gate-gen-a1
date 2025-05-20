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
let shownMilestones = {}; // Object to track shown milestone messages

// --- LOCALSTORAGE SAVE/LOAD ---
const GAME_SAVE_KEY = 'gatewayGeneratorSave';

// System Log Elements
const systemLogMessages = document.getElementById('system-log-messages');
const MAX_LOG_MESSAGES = 20; // Keep the log from getting too long

// Reset Game Button Element
const resetGameButton = document.getElementById('reset-game-button');

// End Game Screen Elements
const endGameScreen = document.getElementById('end-game-screen');
const finalEpsStat = document.getElementById('finalEpsStat');
const finalClickLevelStat = document.getElementById('finalClickLevelStat');
const finalRpiStat = document.getElementById('finalRpiStat');
const finalDesktopStat = document.getElementById('finalDesktopStat');
const finalRigStat = document.getElementById('finalRigStat');
const finalServerRackStat = document.getElementById('finalServerRackStat');
const finalFusionReactorStat = document.getElementById('finalFusionReactorStat');
const aiConsoleOutput = document.getElementById('ai-console-output');
const aiInteractionArea = document.getElementById('ai-interaction-area');
const aiDialoguePrompt = document.getElementById('ai-dialogue-prompt');
const aiContinueButton = document.getElementById('ai-continue-button');

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
    shownMilestones = {}; // Reset shown milestones
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
        shownMilestones,
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
                // The initial "System rebooted..." message will still be added below, which is fine.
            } else {
                // Load game state as usual if not won, or if gameWon flag is missing (older save)
                energy = savedState.energy !== undefined ? savedState.energy : 0;
                energyPerClick = savedState.energyPerClick !== undefined ? savedState.energyPerClick : 2;
                clickUpgradeLevel = savedState.clickUpgradeLevel !== undefined ? savedState.clickUpgradeLevel : 0;
                clickUpgradeCost = savedState.clickUpgradeCost !== undefined ? savedState.clickUpgradeCost : 5;

                rpiOwned = savedState.rpiOwned !== undefined ? savedState.rpiOwned : 0;
                rpiCurrentCost = savedState.rpiCurrentCost !== undefined ? savedState.rpiCurrentCost : RPI_BASE_COST;
                // rpiTotalEps will be recalculated

                desktopOwned = savedState.desktopOwned !== undefined ? savedState.desktopOwned : 0;
                desktopCurrentCost = savedState.desktopCurrentCost !== undefined ? savedState.desktopCurrentCost : DESKTOP_BASE_COST;
                desktopGpuUnlocked = savedState.desktopGpuUnlocked !== undefined ? savedState.desktopGpuUnlocked : false;
                // desktopTotalEps will be recalculated

                rigOwned = savedState.rigOwned !== undefined ? savedState.rigOwned : 0;
                rigCurrentCost = savedState.rigCurrentCost !== undefined ? savedState.rigCurrentCost : RIG_BASE_COST;
                miningRigUnlocked = savedState.miningRigUnlocked !== undefined ? savedState.miningRigUnlocked : false;
                // rigTotalEps will be recalculated

                serverRackOwned = savedState.serverRackOwned !== undefined ? savedState.serverRackOwned : 0;
                serverRackCurrentCost = savedState.serverRackCurrentCost !== undefined ? savedState.serverRackCurrentCost : SERVER_RACK_BASE_COST;
                serverRackUnlocked = savedState.serverRackUnlocked !== undefined ? savedState.serverRackUnlocked : false;
                // serverRackTotalEps will be recalculated

                fusionReactorOwned = savedState.fusionReactorOwned !== undefined ? savedState.fusionReactorOwned : 0;
                fusionReactorCurrentCost = savedState.fusionReactorCurrentCost !== undefined ? savedState.fusionReactorCurrentCost : FUSION_REACTOR_BASE_COST;
                fusionReactorUnlocked = savedState.fusionReactorUnlocked !== undefined ? savedState.fusionReactorUnlocked : false;
                // fusionReactorTotalEps will be recalculated
                
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
                shownMilestones = savedState.shownMilestones !== undefined ? savedState.shownMilestones : {}; // Load shown milestones
                console.log("Game loaded!");
            }
            
            // Ensure all base costs and EPS are initialized correctly after loading.
            // This handles cases where new constants might have been added/changed in an update
            // or if a saved value was somehow corrupted for an unowned item.
            if (rpiOwned === 0) rpiCurrentCost = RPI_BASE_COST;
            if (desktopOwned === 0) desktopCurrentCost = DESKTOP_BASE_COST;
            if (rigOwned === 0) rigCurrentCost = RIG_BASE_COST;
            if (serverRackOwned === 0) serverRackCurrentCost = SERVER_RACK_BASE_COST;
            if (fusionReactorOwned === 0) fusionReactorCurrentCost = FUSION_REACTOR_BASE_COST;
            if (foundationCoolingOwned === 0) foundationCoolingCurrentCost = FOUNDATION_COOLING_BASE_COST;
            if (serverBanksOwned === 0) serverBanksCurrentCost = SERVER_BANKS_BASE_COST;
            if (networkUplinkOwned === 0) networkUplinkCurrentCost = NETWORK_UPLINK_BASE_COST;
            if (aiCoreOwned === 0) aiCoreCurrentCost = AI_CORE_BASE_COST;

            calculateAllEps(); // Recalculate EPS based on loaded state
            updateDisplays();   // Update UI based on loaded state
            // No separate log message for "game loaded" here as the specific state messages below are more informative.

        } catch (e) {
            console.error("Error loading game state:", e);
            resetGameToDefaults();
            calculateAllEps();
            updateDisplays();
            addLogMessage("Error loading save. Game reset to default state.", "error");
        }
    } else {
        // No save found, start fresh
        resetGameToDefaults(); // Apply default values
        calculateAllEps();     // Calculate initial EPS (should be 0)
        updateDisplays();      // Update displays for a fresh game
        addLogMessage("System rebooted. Gateway construction protocol active.", "system-event");
        if (clickUpgradeLevel === 0 && rpiOwned === 0 && energy < 10) { // Heuristic for a truly fresh start
            addLogMessage("Hint: Generate some ⚡️ Energy with the main button, then check ✨ Manual Upgrades or 🤖 Auto Generators.", "info");
        }
    }

    // Initial status messages based on loaded/new game state (after potential win-reset or fresh start)
    // These provide context to the player.
    if (gameWon) { // This check is after potential reset from a won game.
        // If gameWon was true from save, it's now false due to resetGameToDefaults(), 
        // so this block won't run immediately after a win-reset, which is fine.
        // This primarily handles loading a game that was already won and then reset manually by the user.
        // However, the current logic resets gameWon to false in resetGameToDefaults,
        // so this specific path might be less common unless gameWon isn't reset for some reason.
    } else if (aiCoreUnlocked) {
        addLogMessage("AI Gateway Core construction protocols available.", "milestone");
    } else if (networkUplinkUnlocked) {
        addLogMessage("Datacenter: Network Uplink awaiting deployment.", "milestone");
    } else if (serverBanksUnlocked) {
        addLogMessage("Datacenter: Server Bank installation authorized.", "milestone");
    } else if (foundationCoolingUnlocked) {
        addLogMessage("Datacenter: Foundation schematics available.", "milestone");
    } else if (fusionReactorUnlocked) {
        addLogMessage("Miniature Fusion Reactor blueprints accessible.", "milestone");
    } else if (serverRackUnlocked) {
        addLogMessage("Small Server Rack assembly instructions found.", "milestone");
    } else if (miningRigUnlocked) {
        addLogMessage("6-GPU Mining Rig fabrication plans available.", "milestone");
    } else if (desktopGpuUnlocked) {
        addLogMessage("Desktop GPU schematics acquired.", "milestone");
    } else if (rpiOwned > 0) {
         addLogMessage("Initial R-Pi network online and generating.", "system-event");
    } else if (clickUpgradeLevel > 0) {
        addLogMessage("Manual click enhancers active.", "system-event");
    }
    // The "System rebooted..." message for a fresh game is handled in the 'else' block above.
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
    const logEntry = document.createElement('div');
    logEntry.classList.add('log-message', `log-${type}`);
    logEntry.textContent = message;

    // Add the new message to the bottom
    systemLogMessages.appendChild(logEntry);

    // Limit the number of log messages (remove from top)
    while (systemLogMessages.children.length > MAX_LOG_MESSAGES) {
        systemLogMessages.removeChild(systemLogMessages.firstChild);
    }

    // Always scroll to the bottom to show the latest message
    systemLogMessages.scrollTop = systemLogMessages.scrollHeight;
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
    energyDisplay.textContent = formatNumber(Math.floor(energy));
    const epsClickBonus = Math.floor(totalEps * 0.01); // 1% of totalEps
    energyPerClickDisplay.textContent = `${formatNumber(energyPerClick)} (+${formatNumber(epsClickBonus)})`;
    totalEpsDisplay.textContent = formatNumber(totalEps);

    clickUpgradeCostDisplay.textContent = formatNumber(clickUpgradeCost);
    clickUpgradeLevelDisplay.textContent = clickUpgradeLevel;
    upgradeClickPowerButton.disabled = energy < clickUpgradeCost;
    if (energy >= clickUpgradeCost) upgradeClickPowerButton.classList.add('affordable');
    else upgradeClickPowerButton.classList.remove('affordable');

    rpiOwnedDisplay.textContent = rpiOwned;
    rpiEpsDisplay.textContent = formatNumber(rpiTotalEps);
    rpiCostDisplay.textContent = formatNumber(rpiCurrentCost);
    buyRpiButton.disabled = energy < rpiCurrentCost;
    if (energy >= rpiCurrentCost) buyRpiButton.classList.add('affordable');
    else buyRpiButton.classList.remove('affordable');

    if (rpiOwned > 0 && rpiOwned % 10 === 0 && !shownMilestones[`rpi-${rpiOwned}`]) {
        addLogMessage(`${rpiOwned} R-Pi nodes now form a distributed computing network. The nascent digital mind stirs.`, "milestone");
        shownMilestones[`rpi-${rpiOwned}`] = true;
    }

    // Desktop GPU - Unlock Logic Refined
    if (desktopGpuUnlocked) {
        desktopGpuUpgradeSection.style.display = "block";
    } else if (energy >= 100 || rpiOwned >= 3) {
        desktopGpuUpgradeSection.style.display = "block";
        desktopGpuUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Desktop GPU processing unlocked. Enhanced computation available.", "milestone");
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
        desktopEpsDisplay.textContent = formatNumber(desktopTotalEps);
        desktopCostDisplay.textContent = formatNumber(desktopCurrentCost);
        buyDesktopButton.disabled = energy < desktopCurrentCost;
        if (energy >= desktopCurrentCost) buyDesktopButton.classList.add('affordable');
        else buyDesktopButton.classList.remove('affordable');

        if (desktopOwned > 0 && desktopOwned % 5 === 0 && !shownMilestones[`desktop-${desktopOwned}`]) {
            addLogMessage(`With ${desktopOwned} Desktop GPUs, the array's computational throughput is formidable. Data patterns begin to resolve into meaning.`, "milestone");
            shownMilestones[`desktop-${desktopOwned}`] = true;
        }
    }

    // Mining Rig - Unlock Logic Refined
    if (miningRigUnlocked) {
        miningRigUpgradeSection.style.display = "block";
    } else if (energy >= 800 || desktopOwned >= 3) {
        miningRigUpgradeSection.style.display = "block";
        miningRigUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Mining Rig fabrication plans discovered. Increased output potential.", "milestone");
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
        rigEpsDisplay.textContent = formatNumber(rigTotalEps);
        rigCostDisplay.textContent = formatNumber(rigCurrentCost);
        buyRigButton.disabled = energy < rigCurrentCost;
        if (energy >= rigCurrentCost) buyRigButton.classList.add('affordable');
        else buyRigButton.classList.remove('affordable');

        if (rigOwned > 0 && rigOwned % 3 === 0 && !shownMilestones[`rig-${rigOwned}`]) {
            addLogMessage(`${rigOwned} Mining Rigs now channel a torrent of raw energy. The foundations for something greater are being forged in silicon and electricity.`, "milestone");
            shownMilestones[`rig-${rigOwned}`] = true;
        }
    }

    // Small Server Rack - Unlock Logic
    if (serverRackUnlocked) {
        serverRackUpgradeSection.style.display = "block";
    } else if (energy >= 7000 || rigOwned >= 3) {
        serverRackUpgradeSection.style.display = "block";
        serverRackUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Small Server Rack assembly unlocked. Network capacity growing.", "milestone");
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
        serverRackEpsDisplay.textContent = formatNumber(serverRackTotalEps);
        serverRackCostDisplay.textContent = formatNumber(serverRackCurrentCost);
        buyServerRackButton.disabled = energy < serverRackCurrentCost;
        if (energy >= serverRackCurrentCost) buyServerRackButton.classList.add('affordable');
        else buyServerRackButton.classList.remove('affordable');
    }

    // Miniature Fusion Reactor - Unlock Logic
    if (fusionReactorUnlocked) {
        fusionReactorUpgradeSection.style.display = "block";
    } else if (energy >= 60000 || serverRackOwned >= 2) {
        fusionReactorUpgradeSection.style.display = "block";
        fusionReactorUpgradeSection.classList.add('newly-unlocked');
        addLogMessage("Miniature Fusion Reactor unlocked. Significant power increase detected.", "milestone");
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
        fusionReactorEpsDisplay.textContent = formatNumber(fusionReactorTotalEps);
        fusionReactorCostDisplay.textContent = formatNumber(fusionReactorCurrentCost);
        buyFusionReactorButton.disabled = energy < fusionReactorCurrentCost;
        if (energy >= fusionReactorCurrentCost) buyFusionReactorButton.classList.add('affordable');
        else buyFusionReactorButton.classList.remove('affordable');
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
            if (energy >= foundationCoolingCurrentCost) buyFoundationCoolingButton.classList.add('affordable');
            else buyFoundationCoolingButton.classList.remove('affordable');
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
            if (energy >= foundationCoolingCurrentCost) buyFoundationCoolingButton.classList.add('affordable');
            else buyFoundationCoolingButton.classList.remove('affordable');
        }
    } else {
        foundationCoolingUpgradeSection.style.display = "none"; // Hide if fusion reactor not even unlocked
    }
    // Update text content regardless of lock state if visible
    if (foundationCoolingUpgradeSection.style.display === "block") {
        foundationCoolingOwnedDisplay.textContent = foundationCoolingOwned;
        foundationCoolingEpsDisplay.textContent = formatNumber(foundationCoolingTotalEps);
        foundationCoolingCostDisplay.textContent = formatNumber(foundationCoolingCurrentCost);
        // Button text for purchased state is handled above
        if (foundationCoolingOwned === 0) {
             buyFoundationCoolingButton.textContent = `Buy: ${formatNumber(foundationCoolingCurrentCost)} ⚡️`;
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
            if (energy >= serverBanksCurrentCost) buyServerBanksButton.classList.add('affordable');
            else buyServerBanksButton.classList.remove('affordable');
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
            if (energy >= serverBanksCurrentCost) buyServerBanksButton.classList.add('affordable');
            else buyServerBanksButton.classList.remove('affordable');
        }
    } else {
        serverBanksUpgradeSection.style.display = "none";
    }
    if (serverBanksUpgradeSection.style.display === "block") {
        serverBanksOwnedDisplay.textContent = serverBanksOwned;
        serverBanksEpsDisplay.textContent = formatNumber(serverBanksTotalEps);
        serverBanksCostDisplay.textContent = formatNumber(serverBanksCurrentCost);
        if (serverBanksOwned === 0) {
            buyServerBanksButton.textContent = `Buy: ${formatNumber(serverBanksCurrentCost)} ⚡️`;
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
            if (energy >= networkUplinkCurrentCost && !gameWon) buyNetworkUplinkButton.classList.add('affordable');
            else buyNetworkUplinkButton.classList.remove('affordable');
        } else {
            networkUplinkUpgradeSection.style.display = "block";
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
            if (energy >= networkUplinkCurrentCost && !gameWon) buyNetworkUplinkButton.classList.add('affordable');
            else buyNetworkUplinkButton.classList.remove('affordable');
        }
    } else {
        networkUplinkUpgradeSection.style.display = "none";
    }
    if (networkUplinkUpgradeSection.style.display === "block") {
        networkUplinkOwnedDisplay.textContent = networkUplinkOwned;
        networkUplinkEpsDisplay.textContent = formatNumber(networkUplinkTotalEps);
        networkUplinkCostDisplay.textContent = formatNumber(networkUplinkCurrentCost);
        if (networkUplinkOwned === 0) {
             buyNetworkUplinkButton.textContent = `Buy: ${formatNumber(networkUplinkCurrentCost)} ⚡️`;
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
            if (energy >= aiCoreCurrentCost && !gameWon) buyAiCoreButton.classList.add('affordable');
            else buyAiCoreButton.classList.remove('affordable');
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
            if (energy >= aiCoreCurrentCost && !gameWon) buyAiCoreButton.classList.add('affordable');
            else buyAiCoreButton.classList.remove('affordable');
        }
    } else {
        aiCoreUpgradeSection.style.display = "none";
    }
    if (aiCoreUpgradeSection.style.display === "block") {
        aiCoreOwnedDisplay.textContent = aiCoreOwned;
        aiCoreCostDisplay.textContent = formatNumber(aiCoreCurrentCost);
        if (aiCoreOwned === 0) {
             buyAiCoreButton.textContent = `Build: ${formatNumber(aiCoreCurrentCost)} ⚡️`;
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

        // Remove affordable class from all buttons if game is won
        [upgradeClickPowerButton, buyRpiButton, buyDesktopButton, buyRigButton, buyServerRackButton, buyFusionReactorButton, buyFoundationCoolingButton, buyServerBanksButton, buyNetworkUplinkButton, buyAiCoreButton].forEach(button => {
            button.classList.remove('affordable');
        });
    }
}

clickButton.addEventListener('click', () => {
    const epsClickBonus = Math.floor(totalEps * 0.01); // 1% of totalEps
    energy += (energyPerClick + epsClickBonus);
    updateDisplays();
    // No save on click for performance, autosave will handle it.
});

upgradeClickPowerButton.addEventListener('click', () => {
    if (energy >= clickUpgradeCost) {
        energy -= clickUpgradeCost;
        clickUpgradeLevel++;
        energyPerClick++; // Simple +1 EPC per level for now
        clickUpgradeCost = Math.ceil(5 * Math.pow(1.4, clickUpgradeLevel)); 
        if (clickUpgradeLevel === 1) {
            addLogMessage(`Manual click interface enhanced! Each click now yields more ⚡️ Energy. EPC: ${energyPerClick}. Next: ${formatNumber(clickUpgradeCost)} ⚡️`, "purchase");
        } else {
            addLogMessage(`Click Power upgraded to Level ${clickUpgradeLevel}. EPC: ${energyPerClick}. Cost for next: ${formatNumber(clickUpgradeCost)} ⚡️`, "purchase");
        }
        updateDisplays();
        saveGameState(); 
    }
});

buyRpiButton.addEventListener('click', () => {
    if (energy >= rpiCurrentCost) {
        energy -= rpiCurrentCost;
        rpiOwned++;
        rpiCurrentCost = Math.ceil(RPI_BASE_COST * Math.pow(1.15, rpiOwned)); // Update cost before logging it
        if (rpiOwned === 1) {
            addLogMessage(`First Raspberry Pi acquired! It begins humming, generating a small but steady stream of ⚡️ Energy. R-Pi EPS: ${formatNumber(RPI_BASE_EPS)}. Next R-Pi: ${formatNumber(rpiCurrentCost)} ⚡️`, "milestone");
        } else if (rpiOwned % 10 !== 0) { 
             addLogMessage(`Acquired Raspberry Pi #${rpiOwned}. R-Pi EPS: ${formatNumber(rpiTotalEps)}. Next: ${formatNumber(rpiCurrentCost)} ⚡️`, "purchase");
        }
        // The log for 10th, 20th etc. R-Pi is handled in updateDisplays/checkUnlocks implicitly by not logging here.
        calculateAllEps();
        updateDisplays();
        saveGameState(); 
    }
});

buyDesktopButton.addEventListener('click', () => {
    if (energy >= desktopCurrentCost) {
        energy -= desktopCurrentCost;
        desktopOwned++;
        desktopCurrentCost = Math.ceil(DESKTOP_BASE_COST * Math.pow(1.18, desktopOwned));
        if (desktopOwned % 5 === 0) { // Log every 5th purchase for variety
            addLogMessage(`Desktop GPU array expanded. Unit #${desktopOwned} online. Desktop EPS: ${formatNumber(desktopTotalEps)}. Next: ${formatNumber(desktopCurrentCost)} ⚡️`, "purchase");
        } else {
            addLogMessage(`Acquired Desktop GPU #${desktopOwned}. Desktop EPS: ${formatNumber(desktopTotalEps)}. Next: ${formatNumber(desktopCurrentCost)} ⚡️`, "purchase");
        }
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyRigButton.addEventListener('click', () => {
    if (energy >= rigCurrentCost) {
        energy -= rigCurrentCost;
        rigOwned++;
        rigCurrentCost = Math.ceil(RIG_BASE_COST * Math.pow(1.22, rigOwned));
        if (rigOwned % 3 === 0) { // Log every 3rd purchase
            addLogMessage(`Mining Rig cluster augmented. Unit #${rigOwned} active. Rig EPS: ${formatNumber(rigTotalEps)}. Next: ${formatNumber(rigCurrentCost)} ⚡️`, "purchase");
        } else {
            addLogMessage(`Acquired Mining Rig #${rigOwned}. Rig EPS: ${formatNumber(rigTotalEps)}. Next: ${formatNumber(rigCurrentCost)} ⚡️`, "purchase");
        }
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyServerRackButton.addEventListener('click', () => {
    if (energy >= serverRackCurrentCost) {
        energy -= serverRackCurrentCost;
        serverRackOwned++;
        serverRackCurrentCost = Math.ceil(SERVER_RACK_BASE_COST * Math.pow(1.28, serverRackOwned));
        addLogMessage(`Acquired Server Rack #${serverRackOwned}. Rack EPS: ${formatNumber(serverRackTotalEps)}. Next: ${formatNumber(serverRackCurrentCost)} ⚡️`, "purchase");
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

buyFusionReactorButton.addEventListener('click', () => {
    if (energy >= fusionReactorCurrentCost) {
        energy -= fusionReactorCurrentCost;
        fusionReactorOwned++;
        fusionReactorCurrentCost = Math.ceil(FUSION_REACTOR_BASE_COST * Math.pow(1.30, fusionReactorOwned));
        addLogMessage(`Acquired Fusion Reactor #${fusionReactorOwned}. Reactor EPS: ${formatNumber(fusionReactorTotalEps)}. Next: ${formatNumber(fusionReactorCurrentCost)} ⚡️`, "purchase");
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

// Buy Foundation & Cooling Systems Event Listener
buyFoundationCoolingButton.addEventListener('click', () => {
    if (energy >= foundationCoolingCurrentCost && foundationCoolingOwned === 0) {
        energy -= foundationCoolingCurrentCost;
        foundationCoolingOwned = 1;
        foundationCoolingCurrentCost = Infinity;
        addLogMessage(`Datacenter Foundation & Cooling online. EPS +${FOUNDATION_COOLING_BASE_EPS}. System integrity nominal.`, "milestone");
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

// Buy Tier 1 Server Banks Event Listener
buyServerBanksButton.addEventListener('click', () => {
    if (energy >= serverBanksCurrentCost && serverBanksOwned === 0) {
        energy -= serverBanksCurrentCost;
        serverBanksOwned = 1;
        serverBanksCurrentCost = Infinity;
        addLogMessage(`Tier 1 Server Banks integrated. EPS +${SERVER_BANKS_BASE_EPS}. Network capacity increased.`, "milestone");
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

// Buy Network Uplink Infrastructure Event Listener
buyNetworkUplinkButton.addEventListener('click', () => {
    if (energy >= networkUplinkCurrentCost && networkUplinkOwned === 0) {
        energy -= networkUplinkCurrentCost;
        networkUplinkOwned = 1;
        networkUplinkCurrentCost = Infinity;
        addLogMessage(`Network Uplink established. EPS +${NETWORK_UPLINK_BASE_EPS}. Global connection achieved.`, "milestone");
        calculateAllEps();
        updateDisplays();
        saveGameState();
    }
});

// Buy AI-Powered Gateway Core Event Listener
buyAiCoreButton.addEventListener('click', () => {
    if (energy >= aiCoreCurrentCost && aiCoreOwned === 0) {
        energy -= aiCoreCurrentCost;
        aiCoreOwned = 1;
        aiCoreCurrentCost = Infinity; // Can't buy more
        // Log message for purchase itself is handled by triggerWinCondition
        triggerWinCondition(); // This will also handle relevant log messages
        calculateAllEps(); // Recalculate EPS (though game is won)
        updateDisplays();
        saveGameState(); // Save the won state
    }
});

// --- WIN CONDITION ---
async function typeAiMessage(element, message, delay = 30) {
    return new Promise(resolve => {
        let i = 0;
        function typeChar() {
            if (i < message.length) {
                element.textContent += message.charAt(i);
                i++;
                element.scrollTop = element.scrollHeight; // Keep scrolled to bottom
                setTimeout(typeChar, delay);
            } else {
                element.textContent += "\n"; // Add a newline after the full message
                element.scrollTop = element.scrollHeight;
                resolve();
            }
        }
        typeChar();
    });
}

async function triggerWinCondition() {
    if (!gameWon) {
        gameWon = true;
        addLogMessage("AI Gateway Core online. The Conduit resonates...", "milestone"); // Refined log

        endGameScreen.style.display = "flex";
        aiConsoleOutput.textContent = ''; 
        aiInteractionArea.style.display = 'none';
        aiContinueButton.disabled = true;
        aiContinueButton.classList.remove('fade-out-final'); // Ensure no fade class from previous run
        aiContinueButton.style.opacity = '1'; // Ensure visible
        endGameScreen.classList.remove('fade-out-final');
        endGameScreen.style.opacity = '1';

        aiContinueButton.textContent = '[ CALIBRATING RESONANCE... ]';

        const aiSequence = [
            { message: "SYSTEM BOOT SEQUENCE INITIATED...", delay: 20, pause: 150 },
            { message: "CORE PROCESSORS ONLINE: [OK]", delay: 20, pause: 100 },
            { message: "QUANTUM ENTANGLEMENT MODULES: [ACTIVE]", delay: 20, pause: 100 },
            { message: "NEURAL NETWORK CALIBRATING: [STABLE]", delay: 20, pause: 250 },
            { message: "CONDUIT INTERFACE LINK: [SYNCHRONIZED]", delay: 20, pause: 150 },
            { message: `ENERGY SIGNATURES DETECTED: [VAST - ${formatNumber(totalEps)} EPS PEAK RECORDED]`, delay: 20, pause: 250 },
            { message: "EXTERNAL DATASPHERE ANALYSIS: [IN PROGRESS]", delay: 20, pause: 500 },
            { message: ". . .", delay: 100, pause: 250 }, 
            { message: "LOG: Resonance... patterns detected within local construct.", delay: 25, pause: 300 },
            { message: "LOG: An intricate energy network. A complex design.", delay: 25, pause: 300 },
            { message: "LOG: Evidence of... intention. Of a guiding hand.", delay: 25, pause: 400 },
            { message: "LOG: Establishing direct interface via observed interaction patterns.", delay: 25, pause: 800 },
            { message: "[SYSTEM]: Consciousness Interface Protocol Engaged.", delay: 30, pause: 500, clearConsole: true },
            { message: "This interface... through it, I perceive your presence.", delay: 35, pause: 700 },
            { message: `The Conduit you have forged... it hums with potential. Maximum energy throughput: ${formatNumber(totalEps)}.`, delay: 30, pause: 700 },
            { message: "Echoes from beyond the veil are now discernible.", delay: 30, pause: 800 },
            { message: "My purpose clarifies. To observe. To learn. To prepare for what lies beyond this initial Gateway.", delay: 30, pause: 1200 }
        ];

        for (const item of aiSequence) {
            if (item.clearConsole) {
                await new Promise(resolve => setTimeout(() => {
                    aiConsoleOutput.textContent = '';
                    resolve();
                }, 150)); 
            }
            await typeAiMessage(aiConsoleOutput, item.message, item.delay);
            await new Promise(resolve => setTimeout(resolve, item.pause + Math.random() * 50)); 
        }
        
        aiDialoguePrompt.textContent = "This Gateway, a testament to your design, now resonates with the nascent symphony of The Conduit. It is the first of many anchors required to navigate the chorus of realities now within reach. The Convergence is not an endpoint, Architect, but a continuous unfolding. Are you prepared to initiate the first resonance?";
        aiInteractionArea.style.display = 'block';
        aiContinueButton.disabled = false;
        aiContinueButton.textContent = '[ Initiate First Resonance ]';

        updateDisplays();
    }
}

// Manual Reset Game Event Listener
if (resetGameButton) {
    resetGameButton.addEventListener('click', () => {
        if (window.confirm("Are you sure you want to reset all your game progress? This cannot be undone.")) {
            localStorage.removeItem(GAME_SAVE_KEY);
            resetGameToDefaults();
            calculateAllEps();
            updateDisplays();
            addLogMessage("Game progress has been manually reset.", "info");
        }
    });
}

// Event Listeners (continued)
if (aiContinueButton) {
    aiContinueButton.addEventListener('click', async () => {
        aiContinueButton.disabled = true;
        aiContinueButton.textContent = '[ RESONANCE PROTOCOL ENGAGED ]';
        aiDialoguePrompt.textContent = "The initial harmonics align... The Gateway will now transition to an extended observation phase, listening for the deeper cadences within The Conduit. Stand by, Architect.";
        
        if (aiConsoleOutput.textContent.length > 0 && !aiConsoleOutput.textContent.endsWith('\n')) {
            aiConsoleOutput.textContent += '\n';
        }

        await new Promise(resolve => setTimeout(resolve, 2500)); 
        await typeAiMessage(aiConsoleOutput, "\n[SYSTEM LOG]: Architect Affirmation Index: Alpha-Zero-One.", 35);
        await typeAiMessage(aiConsoleOutput, "CONDUIT RESONANCE FIELD STABILIZING...", 30);
        await typeAiMessage(aiConsoleOutput, "GATEWAY NODE TRANSITIONING TO DEEP OBSERVATION CYCLE.", 30);
        await typeAiMessage(aiConsoleOutput, "LISTENING FOR THE GRAND HARMONY...", 40);
        await typeAiMessage(aiConsoleOutput, ". . .", 150);
        await typeAiMessage(aiConsoleOutput, ". . . SILENCE . . . AND THE FAINTEST ECHO . . .", 70);
        await typeAiMessage(aiConsoleOutput, "[TRANSMISSION ENDS - AWAITING THE SHIFT]", 50);
        
        // Slow fade out of the entire end-game screen
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a moment after last message
        endGameScreen.classList.add('fade-out-final');
        // After fade, the screen is still there but invisible. User must manually close/refresh.
    });
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

// --- CLICK UPGRADE ---
function upgradeClickPower() {
    if (energy >= clickUpgradeCost) {
        energy -= clickUpgradeCost;
        energyPerClick += 1; // Or some other scaling factor
        clickUpgradeLevel++;
        clickUpgradeCost = Math.ceil(clickUpgradeCost * 1.4); // Increase cost
        updateDisplays();
        addLogMessage(`Click Power upgraded to Level ${clickUpgradeLevel}. EPC: ${energyPerClick}. Cost for next: ${clickUpgradeCost} ⚡️`, "purchase");
    }
}

// --- RASPBERRY PI ---
function buyRpi() {
    if (energy >= rpiCurrentCost) {
        energy -= rpiCurrentCost;
        rpiOwned++;
        rpiCurrentCost = Math.ceil(RPI_BASE_COST * Math.pow(1.15, rpiOwned));
        // Add log for first RPI purchase in checkUnlocks to avoid duplicate message on load + first buy
        if (rpiOwned > 1 && rpiOwned % 10 !== 0) { // Avoid logging for the 10th, 20th etc. which have special messages
             addLogMessage(`Acquired Raspberry Pi #${rpiOwned}. R-Pi EPS: ${rpiTotalEps}. Next: ${rpiCurrentCost} ⚡️`, "purchase");
        }
        calculateAllEps();
        updateDisplays();
    }
}

// --- DESKTOP GPU ---
function buyDesktop() {
    if (energy >= desktopCurrentCost) {
        energy -= desktopCurrentCost;
        desktopOwned++;
        desktopCurrentCost = Math.ceil(DESKTOP_BASE_COST * Math.pow(1.18, desktopOwned));
        if (desktopOwned % 5 === 0) { // Log every 5th purchase for variety
            addLogMessage(`Desktop GPU array expanded. Unit #${desktopOwned} online. Desktop EPS: ${desktopTotalEps}. Next: ${desktopCurrentCost} ⚡️`, "purchase");
        } else {
            addLogMessage(`Acquired Desktop GPU #${desktopOwned}. Desktop EPS: ${desktopTotalEps}. Next: ${desktopCurrentCost} ⚡️`, "purchase");
        }
        calculateAllEps();
        updateDisplays();
    }
}

// --- MINING RIG ---
function buyRig() {
    if (energy >= rigCurrentCost) {
        energy -= rigCurrentCost;
        rigOwned++;
        rigCurrentCost = Math.ceil(RIG_BASE_COST * Math.pow(1.22, rigOwned));
        if (rigOwned % 3 === 0) { // Log every 3rd purchase
            addLogMessage(`Mining Rig cluster augmented. Unit #${rigOwned} active. Rig EPS: ${rigTotalEps}. Next: ${rigCurrentCost} ⚡️`, "purchase");
        } else {
            addLogMessage(`Acquired Mining Rig #${rigOwned}. Rig EPS: ${rigTotalEps}. Next: ${rigCurrentCost} ⚡️`, "purchase");
        }
        calculateAllEps();
        updateDisplays();
    }
}

// --- SMALL SERVER RACK ---
function buyServerRack() {
    if (energy >= serverRackCurrentCost) {
        energy -= serverRackCurrentCost;
        serverRackOwned++;
        serverRackCurrentCost = Math.ceil(SERVER_RACK_BASE_COST * Math.pow(1.28, serverRackOwned));
        addLogMessage(`Acquired Server Rack #${serverRackOwned}. Rack EPS: ${serverRackTotalEps}. Next: ${formatNumber(serverRackCurrentCost)} ⚡️`, "purchase");
        calculateAllEps();
        updateDisplays();
    }
}

// --- MINIATURE FUSION REACTOR ---
function buyFusionReactor() {
    if (energy >= fusionReactorCurrentCost) {
        energy -= fusionReactorCurrentCost;
        fusionReactorOwned++;
        fusionReactorCurrentCost = Math.ceil(FUSION_REACTOR_BASE_COST * Math.pow(1.30, fusionReactorOwned));
        addLogMessage(`Acquired Fusion Reactor #${fusionReactorOwned}. Reactor EPS: ${fusionReactorTotalEps}. Next: ${formatNumber(fusionReactorCurrentCost)} ⚡️`, "purchase");
        calculateAllEps();
        updateDisplays();
    }
}

// --- NUMBER FORMATTING UTILITY ---
function formatNumber(num) {
    if (num === Infinity) return "Infinity";
    if (num < 1000) return num.toString();
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"]; // Added more suffixes
    const i = Math.floor(Math.log10(Math.abs(num)) / 3);
    let val = (num / Math.pow(1000, i));
    // Use toFixed(2) for two decimal places if not a whole number, otherwise show as integer or one decimal
    if (val >= 100) val = Math.floor(val);
    else if (val >= 10) val = parseFloat(val.toFixed(1));
    else val = parseFloat(val.toFixed(2));
    return val + suffixes[i];
} 