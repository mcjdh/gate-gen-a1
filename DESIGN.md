# Gateway Generator - Design Document

## Core Concept

A clicker game where the player builds up an energy generation empire. Starting with manual clicks, the player unlocks progressively more powerful and automated methods of energy generation, from small devices to large-scale datacenters, ultimately aiming to build a "Gateway Datacenter".

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
    - [x] Logic to apply the upgrade bonus and scale its cost (e.g., `cost = baseCost * 1.5^level`).
    - [x] Initial values: Base Cost 10 Energy, +1 EPC per level.
- [ ] **Automatic Generators (Energy Per Second - EPS):**
    - [ ] **Tier 1: "Local Raspberry Pi"**
        - [x] Unlocks: Early game (e.g., Player Energy >= 50).
        - [x] Base Cost: ~100 Energy.
        - [x] Base EPS: 1 EPS per unit.
        - [x] Cost scaling per unit: `cost = baseCost * 1.15^owned`.
        - [x] UI element: Button to buy, shows name, cost, current EPS contribution, number owned.
        - [x] Logic: Deduct Energy, add to owned count, update total EPS.
    - [ ] **Tier 2: "Desktop with NVIDIA GPU"**
        - [x] Unlocks: Mid game (e.g., Player Energy >= 500 or Owns 5+ Raspberry Pis).
        - [x] Base Cost: ~750 Energy.
        - [x] Base EPS: 10 EPS per unit.
        - [x] Cost scaling per unit: `cost = baseCost * 1.20^owned`.
        - [x] UI and Logic: Similar to Tier 1. (Implemented)
        - [x] Implement Unlock Condition visibility (show/hide section, temporary glow, permanent once unlocked).
    - [ ] **Tier 3: "6 GPU Mining Rig"**
        - [x] Unlocks: (e.g., Player Energy >= 10,000 or Owns 5+ Desktops).
        - [x] Base Cost: ~15,000 Energy.
        - [x] Base EPS: 100 EPS per unit.
        - [x] Cost scaling per unit: `cost = baseCost * 1.25^owned`.
        - [x] UI and Logic: Similar to Tier 1. (Implemented)
        - [x] Implement Unlock Condition visibility (show/hide section, temporary glow, permanent once unlocked).
    - [ ] **Tier 4: "Small Server Rack"**
        - [ ] Unlocks: (e.g., Player Energy >= 200,000 or Owns 5+ Mining Rigs).
        - [ ] Base Cost: ~300,000 Energy.
        - [ ] Base EPS: 1,200 EPS per unit.
        - [ ] Cost scaling per unit: `cost = baseCost * 1.30^owned`.
        - [ ] UI and Logic: Similar to Tier 1.
        - [ ] Implement Unlock Condition visibility (show/hide section, temporary glow, permanent once unlocked).
    - [ ] **Tier 5: "Miniature Fusion Reactor" (Advanced Generator)**
        - [ ] Unlocks: Late game (e.g., Player Energy >= 50,000,000).
        - [ ] Base Cost: ~75,000,000 Energy.
        - [ ] Base EPS: 50,000 EPS per unit.
        - [ ] Cost scaling per unit: `cost = baseCost * 1.35^owned`.
        - [ ] UI and Logic: Similar to Tier 1.
        - [ ] Implement Unlock Condition visibility (show/hide section, temporary glow, permanent once unlocked).
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
    - [ ] Animation or effect on main click button.
- [x] **Upgrade Display:** Clearly show current levels, costs, and contributions, using minimalist theme.
- [ ] **Autosave/Manual Save:** Persist game state (localStorage is a good option for simplicity).
- [x] **Clearer Upgrade Buttons:** Distinct buttons for each upgrade type, enable/disable based on affordability (covered by current implementation).
- [ ] **Theming/Artwork:** (Optional, later stage) Visuals related to energy, tech, and data centers.

### End Game

- [ ] **Final Goal: Build the "Gateway Datacenter"**
    - [ ] This is a series of very expensive, unique upgrades representing components of the Datacenter.
    - [ ] **Component 1: "Foundation & Cooling Systems"**
        - [ ] Cost: ~1 Billion Energy.
        - [ ] Effect: + Large flat EPS or % EPS boost.
    - [ ] **Component 2: "Tier 1 Server Banks"**
        - [ ] Cost: ~10 Billion Energy.
        - [ ] Effect: + Large flat EPS or % EPS boost.
    - [ ] **Component 3: "Network Uplink Infrastructure"**
        - [ ] Cost: ~50 Billion Energy.
        - [ ] Effect: + Large flat EPS or % EPS boost.
    - [ ] **Component 4: "AI-Powered Gateway Core" (Final Piece)**
        - [ ] Cost: ~250 Billion Energy.
        - [ ] Effect: Triggers win condition.
    - [ ] Implement a win condition/acknowledgement screen/message.

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
*   Costs and EPS values are estimates and will need playtesting and iteration.
*   Consider interplay between click and auto-generation (e.g., click boosts based on % of EPS).
*   Unlock conditions can be a mix of Energy owned and units of previous tier owned. Unlocks are permanent once achieved for a game session. 