# Gateway Generator - Design Document

## Core Concept

A clicker game where the player builds up an energy generation empire. Starting with manual clicks, the player unlocks progressively more powerful and automated methods of energy generation, from small devices to large-scale datacenters, ultimately aiming to build a "Gateway Datacenter".

## Core Gameplay Loop

1.  Player clicks the main button to generate a small amount of **Energy**.
2.  Player uses **Energy** to buy upgrades.
3.  Upgrades can:
    *   Increase the amount of **Energy** generated per click.
    *   Automatically generate **Energy** over time.
4.  Player unlocks new tiers of upgrades or new types of generators as they progress.

## Feature Wishlist & Task List

### MVP (Minimum Viable Product)

- [x] Basic HTML structure (`index.html`)
- [x] Basic CSS styling (`style.css`)
- [x] Core click-to-increment score functionality (`script.js`)
- [x] Display current score
- [x] Dark mode UI (default)
- [x] Mobile responsive layout
- [x] Project renamed to "Gateway Generator"
- [x] Initial Git setup and push to remote repository

### Core Gameplay Features

- [ ] **Resource Naming:**
    - [x] The primary resource will be called "Energy".
    - [ ] The score display should reflect this (e.g., "Energy: 0").
- [ ] **Upgrades:**
    - [ ] First click upgrade: Increase Energy per click (e.g., "Ergonomic Mouse", "Capacitive Touch Gloves")
        - [ ] Define cost scaling for this upgrade.
        - [ ] UI element to buy this upgrade.
        - [ ] Logic to apply the upgrade bonus.
    - [ ] First automatic generator: (e.g., "Local Raspberry Pi")
        - [ ] Define cost and generation rate.
        - [ ] UI element to buy this generator.
        - [ ] Logic for automatic Energy increase over time.
    - [ ] Subsequent automatic generators with increasing power and cost (e.g., "Desktop with NVIDIA GPU", "6 GPU Mining Rig", "Small Server Rack", "Miniature Fusion Reactor")
- [ ] **Multiple Upgrade Tiers:** Allow purchasing upgrades multiple times with increasing cost and effect.

### UI/UX Enhancements

- [ ] **Visual Feedback:** Animation or effect on click.
- [ ] **Upgrade Display:** Clearly show current upgrade levels, costs, and Energy/sec for generators.
- [ ] **Autosave/Manual Save:** Persist game state (localStorage is a good option for simplicity).
- [ ] **Clearer Upgrade Buttons:** Distinct buttons for each upgrade type.
- [ ] **Theming/Artwork:** (Optional, later stage) Visuals related to energy, tech, and data centers.

### End Game

- [ ] **Final Goal:** Build the "Gateway Datacenter".
    - [ ] Define the requirements/cost for this final upgrade.
    - [ ] Implement a win condition/acknowledgement.

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

*   Keep it simple initially.
*   Focus on satisfying progression and the chosen theme. 