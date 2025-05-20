# Gateway Generator - Design Document

## Core Concept

A clicker game where the player builds up an energy generation empire. Starting with manual clicks, the player unlocks progressively more powerful and automated methods of energy generation, from small devices to large-scale datacenters, ultimately aiming to build a "Gateway Datacenter".

**Note (Nov 2023 Rebalance):** The game has been significantly rebalanced to target a ~15 minute completion time. Costs, EPS, and unlock conditions have been adjusted accordingly.

## Core Gameplay Loop

1.  Player clicks the main button to generate a small amount of **Energy**.
2.  Player uses **Energy** to buy upgrades.
3.  Upgrades can:
    *   Increase the amount of **Energy** generated per click (EPC).
    *   Automatically generate **Energy** over time (Energy Per Second - EPS).
4.  Player unlocks new tiers of upgrades or new types of generators as they progress.

## Feature Wishlist & Task List

### MVP (Minimum Viable Product)

- [x] Basic HTML structure (`index.html`)
- [x] Basic CSS styling (`style.css`)
- [x] Core click-to-increment score functionality (`script.js`)
- [x] Display current score/Energy
- [x] Dark mode UI (default)
- [x] Mobile responsive layout
- [x] Project renamed to "Gateway Generator"
- [x] Initial Git setup and push to remote repository
- [x] Themed resource as "Energy"

### Core Gameplay Features

- [ ] **Resource Naming:**
    - [x] The primary resource will be called "Energy".
    - [x] The score display reflects this (e.g., "Energy: 0").
- [x] **Click Upgrades:** (e.g., "Enhanced Clicks")
    - [x] Increases Energy Per Click (EPC).
    - [x] UI element to buy this upgrade, showing cost and current level.
    - [x] Logic to apply the upgrade bonus and scale its cost (e.g., `cost = baseCost * 1.4^level`).
    - [x] Initial values: Base Cost 5 Energy (was 10), +1 EPC per level. (Initial EPC is 2). Cost scaling factor 1.4 (was 1.5).
- [ ] **Automatic Generators (Energy Per Second - EPS):**
    - [ ] **Tier 1: "Local Raspberry Pi"**
        - [x] Unlocks: Early game.
        - [x] Base Cost: 20 Energy (was 100).
        - [x] Base EPS: 2 EPS per unit (was 1).
        - [x] Cost scaling per unit: `cost = baseCost * 1.15^owned`.
        - [x] UI element: Button to buy, shows name, cost, current EPS contribution, number owned.
        - [x] Logic: Deduct Energy, add to owned count, update total EPS.
    - [ ] **Tier 2: "Desktop with NVIDIA GPU"**
        - [x] Unlocks: Energy >= 100 (was 500) or Owns 3+ (was 5+) Raspberry Pis.
        - [x] Base Cost: 150 Energy (was 750).
        - [x] Base EPS: 25 EPS per unit (was 10).
        - [x] Cost scaling per unit: `cost = baseCost * 1.18^owned` (was 1.20).
        - [x] UI and Logic: Similar to Tier 1.
        - [x] Implement Unlock Condition visibility.
    - [ ] **Tier 3: "6 GPU Mining Rig"**
        - [x] Unlocks: Energy >= 800 (was 10,000) or Owns 3+ (was 5+) Desktops.
        - [x] Base Cost: 1,200 Energy (was 15,000).
        - [x] Base EPS: 200 EPS per unit (was 100).
        - [x] Cost scaling per unit: `cost = baseCost * 1.22^owned` (was 1.25).
        - [x] UI and Logic: Similar to Tier 1.
        - [x] Implement Unlock Condition visibility.
    - [ ] **Tier 4: "Small Server Rack"**
        - [x] Unlocks: Energy >= 7,000 (was 200,000) or Owns 3+ (was 5+) Mining Rigs.
        - [x] Base Cost: 10,000 Energy (was 300,000).
        - [x] Base EPS: 1,500 EPS per unit (was 1,200).
        - [x] Cost scaling per unit: `cost = baseCost * 1.28^owned` (was 1.30).
        - [x] UI and Logic: Similar to Tier 1.
        - [x] Implement Unlock Condition visibility.
    - [ ] **Tier 5: "Miniature Fusion Reactor" (Advanced Generator)**
        - [x] Unlocks: Energy >= 60,000 (was 50,000,000) or Owns 2+ (was 5+) Server Racks.
        - [x] Base Cost: 80,000 Energy (was 37,500,000).
        - [x] Base EPS: 10,000 EPS per unit (was 50,000).
        - [x] Cost scaling per unit: `cost = baseCost * 1.30^owned` (was 1.35).
        - [x] UI and Logic: Similar to Tier 1.
        - [x] Implement Unlock Condition visibility.
    - [ ] General Logic: Need a game loop (`setInterval`) to add `totalEPS` to `Energy` every second and update displays.
        - [x] Implemented basic game loop updating Energy and displays.
        - [x] Implemented `totalEPS` calculation and display.

### UI/UX Enhancements

- [x] **Total EPS Display:** Show current total Energy Per Second from all generators.
- [x] **Minimalist Emoji Theming:**
    - [x] Energy: `⚡️ Energy:`
    - [x] EPC: `🖱️ EPC:`
    - [x] EPS: `⚙️ EPS:`
    - [x] Generate Button: `Generate ⚡️`
    - [x] Section Titles: `✨ Manual Upgrades`, `🤖 Auto Generators`
    - [x] Click Upgrade Button: `✨ Clicks | Lv. [Lvl] | [Cost] ⚡️`
    - [x] Generator Info: `[Emoji] [Brief Name] x[Owned] (+[EPS] EPS)` (e.g., `🍓 R-Pi x0 (+0 EPS)`)
    - [x] Generator Buy Button: `Buy: [Cost] ⚡️`
    - [x] *Focus: Single representative emojis, very brief text descriptors.*
- [ ] **Visual Feedback:**
    - [x] Unlock animation/feedback (temporary glow for new sections).
    - [x] Animation or effect on main click button.
- [x] **Upgrade Display:** Clearly show current levels, costs, and contributions, using minimalist theme.
- [x] **Autosave/Manual Save:** Persist game state (localStorage is a good option for simplicity).
- [x] **Clearer Upgrade Buttons:** Distinct buttons for each upgrade type, enable/disable based on affordability (covered by current implementation).
- [ ] **Theming/Artwork:** (Optional, later stage) Visuals related to energy, tech, and data centers.
- [x] **Narrative Integration & Lore:**
    - [x] Flavor text added to all upgrades to enhance thematic immersion.
    - [x] System Log implemented:
        - [x] Displays key game events (unlocks, major purchases, win condition).
        - [x] Provides narrative snippets and feedback to the player.
        - [x] Smart scrolling and max message limit for usability.
    - [x] Thematic win message implemented.

### End Game

- [x] **Final Goal: Build the "Gateway Datacenter"**
    - [x] This is a series of very expensive, unique upgrades representing components of the Datacenter.
    - [x] **Component 1: "Foundation & Cooling Systems"**
        - [x] Cost: 500,000 Energy (was ~1 Billion).
        - [x] Effect: +100,000 EPS (was +1,000,000).
        - [x] Unlock: Energy >= 400,000 (was 500M) or 1+ Fusion Reactor.
    - [x] **Component 2: "Tier 1 Server Banks"**
        - [x] Cost: 2,000,000 Energy (was ~10 Billion).
        - [x] Effect: +500,000 EPS (was +15,000,000).
        - [x] Unlock: 1+ Foundation & Cooling and Energy >= 1,500,000 (was 5B).
    - [x] **Component 3: "Network Uplink Infrastructure"**
        - [x] Cost: 5,000,000 Energy (was ~50 Billion).
        - [x] Effect: +1,000,000 EPS (was +75,000,000).
        - [x] Unlock: 1+ Tier 1 Server Banks and Energy >= 4,000,000 (was 25B).
    - [x] **Component 4: "AI-Powered Gateway Core" (Final Piece)**
        - [x] Cost: 10,000,000 Energy (was ~250 Billion).
        - [x] Effect: Triggers win condition.
        - [x] Unlock: 1+ Network Uplink and Energy >= 8,000,000 (was 100B).
    - [x] Implement a win condition/acknowledgement screen/message (Achieved via System Log and alert).

### Advanced Features (Post-MVP)

- [ ] **Prestige System:** (e.g., "Reconfigure Gateway Matrix" - reset for permanent boost)
- [ ] **Multiple Currencies/Resources:** (e.g., "Coolant", "Bandwidth" for specific upgrades)
- [ ] **Achievements:** Reward players for reaching milestones (e.g., "First Kilowatt", "Megacorp Status").
- [ ] **Offline Progress:** Calculate Energy earned while the game was closed.
- [ ] **Sound Effects/Music.**

## Technology Stack

*   HTML
*   CSS
*   Vanilla JavaScript

## Notes

*   Focus on satisfying progression and the chosen theme.
*   Costs and EPS values are estimates and will need playtesting and iteration. (Original note - still true, especially after major rebalance).
*   Consider interplay between click and auto-generation (e.g., click boosts based on % of EPS).
*   Unlock conditions can be a mix of Energy owned and units of previous tier owned. Unlocks are permanent once achieved for a game session.
    *   Fusion Reactor cost adjusted from 75M to 37.5M (11/16/2023). *Further adjusted in Nov 2023 rebalance.*
    *   Fusion Reactor unlock condition changed to also include owning 5+ Server Racks (11/16/2023). *Further adjusted in Nov 2023 rebalance.*
    *   Initial energyPerClick changed from 1 to 2 (11/16/2023). *Click cost and scaling also changed in Nov 2023 rebalance.*
    *   **Nov 2023 Rebalance for ~15 min playthrough: All costs, EPS, and unlock conditions significantly altered.** 