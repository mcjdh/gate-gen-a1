// Procedural Sound Generation for Gateway Protocol

console.log("sound.js loaded");

let audioContext = null;
let masterGain = null;
let isPlaying = false;
let isAudioUnlocked = false;
let audioUnlockPromptVisible = false;

// Element for the audio unlock prompt
let audioUnlockPrompt = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Centralized audio unlocking mechanism
function unlockAudioContext() {
    const ac = getAudioContext();
    if (!ac) return false;
    
    if (ac.state === 'running') {
        isAudioUnlocked = true;
        hideAudioUnlockPrompt();
        return true;
    }
    
    // Try to resume the audio context
    ac.resume().then(() => {
        console.log('AudioContext resumed successfully');
        isAudioUnlocked = true;
        hideAudioUnlockPrompt();
        
        // Also ensure the song audio context is resumed if it exists
        if (songAudioContext && songAudioContext !== ac) {
            songAudioContext.resume().then(() => {
                console.log('Song AudioContext resumed successfully');
            }).catch(err => {
                console.warn('Error resuming song AudioContext:', err);
            });
        }
        
        // Trigger events to let other code know audio is now available
        document.dispatchEvent(new Event('audioUnlocked'));
        
        // Start audio if called from a user interaction but not yet playing
        if (typeof startAmbientMusic === 'function' && !isPlaying) {
            startAmbientMusic();
        }
        
        if (typeof startProceduralSong === 'function' && !isSongPlaying) {
            startProceduralSong();
        }
    }).catch(err => {
        console.warn('Error resuming AudioContext:', err);
        showAudioUnlockPrompt();
    });
    
    return ac.state === 'running';
}

// Create and show audio unlock prompt
function showAudioUnlockPrompt() {
    if (audioUnlockPromptVisible || isAudioUnlocked) return;
    
    if (!audioUnlockPrompt) {
        audioUnlockPrompt = document.createElement('div');
        audioUnlockPrompt.id = 'audio-unlock-prompt';
        audioUnlockPrompt.innerHTML = `
            <div class="audio-unlock-content">
                <p>Tap to enable sound</p>
                <button id="audio-unlock-button">Enable</button>
            </div>
        `;
        audioUnlockPrompt.style.position = 'fixed';
        audioUnlockPrompt.style.bottom = '20px';
        audioUnlockPrompt.style.left = '20px'; // Move to left side per user feedback
        audioUnlockPrompt.style.zIndex = '1000';
        audioUnlockPrompt.style.fontSize = '14px';
        audioUnlockPrompt.style.textAlign = 'center';
        
        // Apply different styles based on dark mode
        if (document.body.classList.contains('dark-mode')) {
            // Dark mode styling
            audioUnlockPrompt.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
            audioUnlockPrompt.style.color = '#e0e0e0';
            audioUnlockPrompt.style.fontFamily = "'VT323', monospace";
            audioUnlockPrompt.style.border = '1px solid #444';
            audioUnlockPrompt.style.boxShadow = '0 0 10px rgba(200, 200, 200, 0.2)';
        } else {
            // Light mode styling
            audioUnlockPrompt.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            audioUnlockPrompt.style.color = '#333';
            audioUnlockPrompt.style.fontFamily = 'sans-serif';
            audioUnlockPrompt.style.border = '1px solid #ddd';
            audioUnlockPrompt.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        }
        
        audioUnlockPrompt.style.padding = '10px';
        audioUnlockPrompt.style.borderRadius = '5px';
        
        // Style the button to match the game's aesthetics
        const button = audioUnlockPrompt.querySelector('button');
        if (button) {
            if (document.body.classList.contains('dark-mode')) {
                // Dark mode button
                button.style.backgroundColor = '#333';
                button.style.color = '#e0e0e0';
                button.style.border = '1px solid #555';
                button.style.fontFamily = "'VT323', monospace";
            } else {
                // Light mode button
                button.style.backgroundColor = '#007bff';
                button.style.color = 'white';
                button.style.border = '1px solid #0056b3';
            }
            button.style.padding = '5px 10px';
            button.style.cursor = 'pointer';
            button.style.marginTop = '5px';
            button.style.borderRadius = '4px';
        }
        
        // Add explicit click handler for the button
        audioUnlockPrompt.addEventListener('click', (e) => {
            unlockAudioContext();
            
            // Start audio if not already playing
            if (!isPlaying && typeof startAmbientMusic === 'function') {
                startAmbientMusic();
            }
            if (!isSongPlaying && typeof startProceduralSong === 'function') {
                startProceduralSong();
            }
            
            hideAudioUnlockPrompt();
            e.stopPropagation(); // Prevent event bubbling
        });
        
        document.body.appendChild(audioUnlockPrompt);
        
        // Set a timeout to auto-hide the prompt after 10 seconds
        // This prevents it from staying on screen indefinitely if the user doesn't interact with it
        setTimeout(() => {
            if (audioUnlockPromptVisible) {
                hideAudioUnlockPrompt();
            }
        }, 10000);
    } else {
        audioUnlockPrompt.style.display = 'block';
        
        // Also set auto-hide for when it's reshown
        setTimeout(() => {
            if (audioUnlockPromptVisible) {
                hideAudioUnlockPrompt();
            }
        }, 10000);
    }
    
    audioUnlockPromptVisible = true;
}

// Hide audio unlock prompt
function hideAudioUnlockPrompt() {
    if (audioUnlockPrompt) {
        audioUnlockPrompt.style.display = 'none';
        audioUnlockPromptVisible = false;
    }
}

function startAmbientMusic() {
    if (isPlaying) return;
    const ac = getAudioContext();
    if (!ac) {
        console.warn("Web Audio API not supported or context failed to initialize.");
        return;
    }

    // Try to unlock if not already unlocked
    if (!isAudioUnlocked) {
        unlockAudioContext();
    }

    masterGain = ac.createGain();
    masterGain.gain.setValueAtTime(0.05, ac.currentTime); // Start with low volume
    masterGain.connect(ac.destination);

    // Simple atmospheric drone with slight detuning
    const osc1 = ac.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, ac.currentTime); // Low A note (A1)

    const osc2 = ac.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(55.2, ac.currentTime); // Slightly detuned

    // LFO for subtle volume modulation (tremolo)
    const lfo = ac.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, ac.currentTime); // Slow modulation
    const lfoGain = ac.createGain();
    lfoGain.gain.setValueAtTime(0.02, ac.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain); // Modulate the master gain

    // Noise for a bit of texture - very subtle
    const noiseBuffer = ac.createBuffer(2, ac.sampleRate * 2, ac.sampleRate); // 2 seconds stereo buffer
    for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
        const nowBuffering = noiseBuffer.getChannelData(channel);
        for (let i = 0; i < noiseBuffer.length; i++) {
            nowBuffering[i] = Math.random() * 0.005 - 0.0025; // very quiet white noise
        }
    }
    const noiseSource = ac.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter for the noise to make it less harsh (like a distant hum)
    const noiseFilter = ac.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(150, ac.currentTime); // Cut off high frequencies
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(masterGain);

    osc1.connect(masterGain);
    osc2.connect(masterGain);
    
    osc1.start();
    osc2.start();
    lfo.start();
    noiseSource.start();

    isPlaying = true;
    console.log("Ambient music started.");
}

function stopAmbientMusic() {
    if (!isPlaying || !audioContext || !masterGain) return;
    
    // Fade out
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);

    setTimeout(() => {
        if (masterGain) masterGain.disconnect();
        // Oscillators and noise source will stop if their inputs are disconnected and no other references exist,
        // or stop them explicitly if needed, but disconnecting masterGain is often enough.
        // For a cleaner stop, you'd stop each source node.
        isPlaying = false;
        console.log("Ambient music stopped.");
    }, 550); // Ensure fade out completes
}

// Example: Call startAmbientMusic() when appropriate, e.g., after a user interaction.
// For instance, you might call this from your main script.js when the game loads or a specific event occurs.
// Make sure to handle user interaction to start audio context if it's suspended.
// document.body.addEventListener('click', () => startAmbientMusic(), { once: true }); 

// --- Procedural 8-bit Song ---

let songAudioContext = null; 
let songMasterGain = null;
let percussionNodes = {}; 

let isSongPlaying = false;
let currentTempo = 120; // BPM
let nextEighthNoteTime = 0.0; // Scheduler advances based on 8th notes
let currentMelodyIndex = 0;
let currentMelodyNoteEndTime = 0; // When the current melody note finishes
let currentBassIndex = 0;
let currentBassNoteEndTime = 0; // When the current bass note finishes

let lookahead = 25.0; 
let scheduleAheadTime = 0.1; 
let timerID;

// Percussion pattern step, cycles 0-7 for an 8-step (1 measure 4/4) pattern
let percussionStep = 0; 

const C_MAJOR_SCALE = {
    'A1': 55.00, 
    'C2': 65.41,  'D2': 73.42,  'E2': 82.41,  'F2': 87.31,  'G2': 98.00,  'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 
    'REST': 0
};

// Durations are now in number of 8th notes
// 1 = 8th, 2 = quarter, 3 = dotted quarter, 4 = half, 8 = whole note
let melodySequence = [
    { note: 'C4', duration: 4 }, { note: 'E4', duration: 2 }, { note: 'G3', duration: 2 } 
];

let bassSequence = [
    { note: 'C3', duration: 4 }, { note: 'G2', duration: 4 },
    { note: 'A2', duration: 4 }, { note: 'F2', duration: 4 },
    { note: 'C3', duration: 2 }, { note: 'C3', duration: 2 }, { note: 'G2', duration: 4 },
    { note: 'F2', duration: 2 }, { note: 'F2', duration: 2 }, { note: 'C2', duration: 4 },
]; 

let kickEnabled = false;
let hiHatEnabled = false;
let snareEnabled = false;

// Percussion patterns are 8 steps (1 measure of 4/4 in 8th notes)
let KICK_PATTERN = [1, 0, 0, 0, 1, 0, 0, 0]; // Standard kick on 1 and 3 (now 1st and 5th 8th notes)
let HI_HAT_PATTERN = [0, 0, 0, 0, 0, 0, 0, 0]; 
let SNARE_PATTERN = [0, 0, 0, 0, 0, 0, 0, 0]; 

const BASE_MELODY_NOTES = ['C4', 'D4', 'E4', 'F4', 'G4'];
const HIGHER_MELODY_NOTES = ['A4', 'B4', 'C5', 'D5', 'E5'];

function scheduler() {
    const eighthNoteDuration = (60.0 / currentTempo) / 2.0; // Duration of one 8th note in seconds

    while (nextEighthNoteTime < songAudioContext.currentTime + scheduleAheadTime) {
        // --- Schedule Melody ---
        if (songAudioContext.currentTime >= currentMelodyNoteEndTime - (eighthNoteDuration * 0.5)) { // Check if current note is about to end or has ended
            const melodyNoteInfo = melodySequence[currentMelodyIndex % melodySequence.length];
            const melodyFreq = C_MAJOR_SCALE[melodyNoteInfo.note] || 0;
            const melodyActualDurationSeconds = melodyNoteInfo.duration * eighthNoteDuration;

            if (melodyFreq > 0) {
                const mOsc = songAudioContext.createOscillator();
                const mGain = songAudioContext.createGain();
                mOsc.type = 'square';
                mOsc.frequency.setValueAtTime(melodyFreq, nextEighthNoteTime);
                mGain.gain.setValueAtTime(0.3, nextEighthNoteTime);
                mGain.gain.exponentialRampToValueAtTime(0.001, nextEighthNoteTime + melodyActualDurationSeconds * 0.9);
                mOsc.connect(mGain);
                mGain.connect(songMasterGain);
                mOsc.start(nextEighthNoteTime);
                mOsc.stop(nextEighthNoteTime + melodyActualDurationSeconds);
            }
            currentMelodyNoteEndTime = nextEighthNoteTime + melodyActualDurationSeconds;
            currentMelodyIndex++;
            if (currentMelodyIndex >= melodySequence.length) currentMelodyIndex = 0;
        }

        // --- Schedule Bass ---
        if (songAudioContext.currentTime >= currentBassNoteEndTime - (eighthNoteDuration * 0.5)) {
            const bassNoteInfo = bassSequence[currentBassIndex % bassSequence.length];
            const bassFreq = C_MAJOR_SCALE[bassNoteInfo.note] || 0;
            const bassActualDurationSeconds = bassNoteInfo.duration * eighthNoteDuration;

            if (bassFreq > 0) {
                const bOsc = songAudioContext.createOscillator();
                const bGain = songAudioContext.createGain();
                bOsc.type = 'sawtooth';
                bOsc.frequency.setValueAtTime(bassFreq, nextEighthNoteTime);
                bGain.gain.setValueAtTime(0.25, nextEighthNoteTime);
                bGain.gain.exponentialRampToValueAtTime(0.001, nextEighthNoteTime + bassActualDurationSeconds * 0.9);
                bOsc.connect(bGain);
                bGain.connect(songMasterGain);
                bOsc.start(nextEighthNoteTime);
                bOsc.stop(nextEighthNoteTime + bassActualDurationSeconds);
            }
            currentBassNoteEndTime = nextEighthNoteTime + bassActualDurationSeconds;
            currentBassIndex++;
            if (currentBassIndex >= bassSequence.length) currentBassIndex = 0;
        }

        // --- Schedule Percussion (on the 8th note grid) ---
        const currentBeatInMeasure = percussionStep % 8;

        if (kickEnabled && KICK_PATTERN[currentBeatInMeasure] === 1) {
            const kickOsc = songAudioContext.createOscillator();
            const kickGain = songAudioContext.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(120, nextEighthNoteTime);
            kickOsc.frequency.exponentialRampToValueAtTime(40, nextEighthNoteTime + 0.1);
            kickGain.gain.setValueAtTime(0.4, nextEighthNoteTime);
            kickGain.gain.exponentialRampToValueAtTime(0.001, nextEighthNoteTime + 0.15);
            kickOsc.connect(kickGain);
            kickGain.connect(songMasterGain);
            kickOsc.start(nextEighthNoteTime);
            kickOsc.stop(nextEighthNoteTime + 0.15);
        }

        if (hiHatEnabled && HI_HAT_PATTERN[currentBeatInMeasure] === 1) {
            createHiHatSound(nextEighthNoteTime, eighthNoteDuration * 0.9); // Hi-hat duration tied to 8th note
        }

        if (snareEnabled && SNARE_PATTERN[currentBeatInMeasure] === 1) {
            createSnareSound(nextEighthNoteTime, eighthNoteDuration * 1.8); // Snare can be a bit longer
        }

        // --- Advance Time and Indices ---
        nextEighthNoteTime += eighthNoteDuration;
        percussionStep++; // This will cycle 0-7 and then wrap due to % 8 above

    }
    timerID = setTimeout(scheduler, lookahead);
}


function startProceduralSong() {
    if (isSongPlaying) return;
    
    songAudioContext = getAudioContext(); 
    if (!songAudioContext) {
        console.warn("Web Audio API not supported for song.");
        return;
    }
    
    // Try to unlock if not already unlocked
    if (!isAudioUnlocked) {
        unlockAudioContext();
    }

    songMasterGain = songAudioContext.createGain();
    songMasterGain.gain.setValueAtTime(0.08, songAudioContext.currentTime); 
    songMasterGain.connect(songAudioContext.destination);

    currentMelodyIndex = 0;
    currentBassIndex = 0; 
    percussionStep = 0; 
    // Initialize end times to current time so first notes schedule immediately
    currentMelodyNoteEndTime = songAudioContext.currentTime; 
    currentBassNoteEndTime = songAudioContext.currentTime;
    nextEighthNoteTime = songAudioContext.currentTime + 0.05; // Start scheduling shortly

    scheduler(); 

    isSongPlaying = true;
    console.log("Procedural song started with 8th note structure.");
}

function stopProceduralSong() {
    if (!isSongPlaying || !songAudioContext || !songMasterGain) return;
    clearTimeout(timerID);
    
    songMasterGain.gain.exponentialRampToValueAtTime(0.0001, songAudioContext.currentTime + 0.5);
    setTimeout(() => {
        if (songMasterGain) songMasterGain.disconnect();
        isSongPlaying = false;
        console.log("Procedural song stopped.");
    }, 550);
}

function evolveSong(energyScale) {
    if (!isSongPlaying) return;

    currentTempo = 100 + (energyScale * 12); 
    if (songMasterGain) {
      songMasterGain.gain.setValueAtTime(0.06 + energyScale * 0.018, songAudioContext.currentTime); 
    }

    // --- Melody Evolution (Tonal Range & Complexity) - Durations are in 8th notes ---
    if (energyScale === 0 && melodySequence.length > 1) { 
        melodySequence = [{ note: 'C4', duration: 4 }, { note: 'E4', duration: 2 }, { note: 'G3', duration: 2 }];
    }
    if (energyScale >= 1 && melodySequence.length < 5) {
        melodySequence.push({ note: BASE_MELODY_NOTES[Math.floor(Math.random() * BASE_MELODY_NOTES.length)], duration: 2 }); // Quarter note
        melodySequence.push({ note: 'D4', duration: 4 }); // Half note
    }
    if (energyScale >= 3 && melodySequence.length < 7) {
        melodySequence.unshift({ note: HIGHER_MELODY_NOTES[0], duration: 2 }); // A4 quarter
        melodySequence.push({ note: BASE_MELODY_NOTES[Math.floor(Math.random() * BASE_MELODY_NOTES.length)], duration: 1 }); // 8th note
    }
    if (energyScale >= 5 && melodySequence.length < 9) {
        melodySequence.push({ note: HIGHER_MELODY_NOTES[1], duration: 2 }); // B4 quarter
        melodySequence.push({ note: HIGHER_MELODY_NOTES[2], duration: 4 });   // C5 half
    }
    if (energyScale >= 8 && melodySequence.length < 12) {
        melodySequence.push({ note: HIGHER_MELODY_NOTES[3], duration: 1 }); // D5 8th
        melodySequence.push({ note: HIGHER_MELODY_NOTES[4], duration: 2 }); // E5 quarter
        if (Math.random() < 0.3) melodySequence.sort(() => Math.random() - 0.5);
    }

    // --- Bass Evolution (Pattern Complexity) - Durations are in 8th notes ---
    if (energyScale >= 4 && bassSequence.length < 12) {
        bassSequence.push({note: 'E2', duration: 2}); // Quarter
        bassSequence.push({note: 'G2', duration: 2}); // Quarter
    }
    if (energyScale >= 7 && bassSequence.length < 15) {
        bassSequence.unshift({note: 'A1', duration: 4}); // Half
        bassSequence.push({note: 'D2', duration: 1}); // 8th
    }

    // --- Percussion Activation and Pattern Evolution (8-step patterns) ---
    // Kick
    if (energyScale >= 1 && !kickEnabled) {
        kickEnabled = true;
        KICK_PATTERN = [1, 0, 0, 0, 1, 0, 0, 0]; 
        console.log("Kick: Enabled (1, 5)");
    }
    if (energyScale >= 6 && kickEnabled) {
        // Example: Kick on 1, and 2-AND (syncopated)
        KICK_PATTERN = [1, 0, 0, 1, 1, 0, 0, 0]; 
        console.log("Kick: Pattern evolved (1, 2&, 5)");
    }

    // Hi-Hat
    if (energyScale >= 2 && !hiHatEnabled) {
        hiHatEnabled = true;
        HI_HAT_PATTERN = [1, 1, 1, 1, 1, 1, 1, 1]; // Continuous 8ths
        console.log("Hi-hat: Enabled (all 8ths)");
    }
    if (energyScale >= 5 && hiHatEnabled) {
        HI_HAT_PATTERN = [1, 0, 1, 0, 1, 0, 1, 0]; // Open 8ths (on beats)
        console.log("Hi-hat: Pattern evolved (on beats)");
    }
    if (energyScale >= 8 && hiHatEnabled) {
        HI_HAT_PATTERN = [0, 1, 0, 1, 0, 1, 0, 1]; // Off-beat 8ths
        console.log("Hi-hat: Pattern evolved (off-beats)");
    }

    // Snare
    if (energyScale >= 4 && !snareEnabled) { 
        snareEnabled = true;
        SNARE_PATTERN = [0, 0, 0, 0, 1, 0, 0, 0]; // Standard snare on 3 (now 5th 8th note)
        console.log("Snare: Enabled (on 3)");
    }
    if (energyScale >= 7 && snareEnabled) {
        SNARE_PATTERN = [0, 0, 1, 0, 0, 0, 1, 0]; // Snare on 2 and 4 (original feel, 3rd and 7th 8th notes)
        console.log("Snare: Pattern evolved (2 and 4)");
    }
    if (energyScale >= 9 && snareEnabled) {
        SNARE_PATTERN = [0, 0, 1, 0, 1, 0, 1, 1]; // More complex snare
        console.log("Snare: Pattern evolved (complex)");
    }
}

// --- Hi-Hat Sound ---
function createHiHatSound(time, duration = 0.05) { // Default duration shorter for 8th note feel
    if (!songAudioContext || !songMasterGain) return;

    const gain = songAudioContext.createGain();
    // Adjusted hi-hat volume
    gain.gain.setValueAtTime(0.15, time); 
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    gain.connect(songMasterGain);

    const bufferSize = Math.max(1, Math.floor(songAudioContext.sampleRate * duration)); // Ensure bufferSize is at least 1
    const noiseBuffer = songAudioContext.createBuffer(1, bufferSize, songAudioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; 
    }

    const noiseSource = songAudioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpass = songAudioContext.createBiquadFilter();
    bandpass.type = 'highpass';
    bandpass.frequency.value = 7000; 
    bandpass.Q.value = 0.5; // Reduced Q for less ringing

    noiseSource.connect(bandpass);
    bandpass.connect(gain);
    noiseSource.start(time);
    // No explicit stop needed if buffer duration is accurate and not looping
    // For safety, or if duration might be very short leading to issues:
    noiseSource.stop(time + duration + 0.01); // Stop shortly after expected end
}

// --- Snare Sound ---
function createSnareSound(time, duration = 0.1) { // Default duration adjusted
    if (!songAudioContext || !songMasterGain) return;

    const noiseGain = songAudioContext.createGain();
    // Adjusted snare noise volume
    noiseGain.gain.setValueAtTime(0.25, time); 
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    noiseGain.connect(songMasterGain);

    const noiseBufferSize = Math.max(1, Math.floor(songAudioContext.sampleRate * duration));
    const noiseBuffer = songAudioContext.createBuffer(1, noiseBufferSize, songAudioContext.sampleRate);
    const noiseOutput = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
        noiseOutput[i] = Math.random() * 2 - 1; 
    }
    const noiseSource = songAudioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const bandpassFilter = songAudioContext.createBiquadFilter();
    bandpassFilter.type = 'bandpass';
    bandpassFilter.frequency.value = 2500; // Slightly lower for a fatter snare noise
    bandpassFilter.Q.value = 0.8;

    noiseSource.connect(bandpassFilter);
    bandpassFilter.connect(noiseGain);
    noiseSource.start(time);
    noiseSource.stop(time + duration + 0.01);


    const tonalOsc = songAudioContext.createOscillator();
    const tonalGain = songAudioContext.createGain();
    tonalOsc.type = 'triangle'; 
    tonalOsc.frequency.setValueAtTime(200, time); // Slightly lower body
    tonalOsc.frequency.exponentialRampToValueAtTime(100, time + duration * 0.6);

    // Adjusted snare body volume
    tonalGain.gain.setValueAtTime(0.3, time); 
    tonalGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.7);
    
    tonalOsc.connect(tonalGain);
    tonalGain.connect(songMasterGain);
    tonalOsc.start(time);
    tonalOsc.stop(time + duration + 0.01);
}

// --- Cutscene Sound Integration ---

// Enter cutscene-specific audio mode
function enterCutsceneAudioMode(cutsceneId) {
    if (!isSongPlaying) return;
    
    // Save current state to restore later
    const currentState = {
        tempo: currentTempo,
        volume: songMasterGain.gain.value,
        melodySequence: [...melodySequence],
        bassSequence: [...bassSequence],
        kickPattern: [...KICK_PATTERN],
        hiHatPattern: [...HI_HAT_PATTERN],
        snarePattern: [...SNARE_PATTERN]
    };
    
    // Apply cutscene-specific music based on the cutscene ID
    switch(cutsceneId) {
        case 'first-desktop':
            // Simpler, more mysterious music with fewer elements
            melodySequence = [{ note: 'C4', duration: 4 }, { note: 'G3', duration: 4 }];
            currentTempo = 80; // Slower tempo
            kickEnabled = false;
            hiHatEnabled = false;
            snareEnabled = false;
            if (songMasterGain) {
                songMasterGain.gain.setValueAtTime(0.05, songAudioContext.currentTime); // Lower volume
            }
            break;
            
        case 'first-server-rack':
            // More structured, still mysterious
            melodySequence = [
                { note: 'C4', duration: 2 }, { note: 'E4', duration: 2 },
                { note: 'G4', duration: 2 }, { note: 'C5', duration: 4 }
            ];
            currentTempo = 100;
            kickEnabled = true;
            KICK_PATTERN = [1, 0, 0, 0, 1, 0, 0, 0];
            hiHatEnabled = false;
            snareEnabled = false;
            break;
            
        case 'energy-50k':
            // Growing intensity
            melodySequence = [
                { note: 'E4', duration: 2 }, { note: 'G4', duration: 2 },
                { note: 'A4', duration: 2 }, { note: 'C5', duration: 4 }
            ];
            currentTempo = 120;
            kickEnabled = true;
            KICK_PATTERN = [1, 0, 0, 1, 1, 0, 0, 0];
            hiHatEnabled = true;
            HI_HAT_PATTERN = [1, 0, 1, 0, 1, 0, 1, 0];
            snareEnabled = false;
            break;
            
        case 'energy-100k':
            // Dramatic tension
            melodySequence = [
                { note: 'A4', duration: 2 }, { note: 'C5', duration: 2 },
                { note: 'D5', duration: 2 }, { note: 'E5', duration: 4 }
            ];
            currentTempo = 140;
            kickEnabled = true;
            hiHatEnabled = true;
            snareEnabled = true;
            HI_HAT_PATTERN = [0, 1, 0, 1, 0, 1, 0, 1];
            SNARE_PATTERN = [0, 0, 1, 0, 0, 0, 1, 0];
            break;
            
        case 'energy-500k':
            // Triumphant, full arrangement
            melodySequence = [
                { note: 'C5', duration: 2 }, { note: 'D5', duration: 1 },
                { note: 'E5', duration: 2 }, { note: 'G5', duration: 1 },
                { note: 'E5', duration: 2 }, { note: 'D5', duration: 1 },
                { note: 'C5', duration: 4 }
            ];
            currentTempo = 160;
            kickEnabled = true;
            hiHatEnabled = true;
            snareEnabled = true;
            SNARE_PATTERN = [0, 0, 1, 0, 1, 0, 1, 1];
            // Briefly boost the volume
            if (songMasterGain) {
                songMasterGain.gain.setValueAtTime(0.12, songAudioContext.currentTime);
            }
            break;
    }
    
    // Return the saved state so it can be restored later
    return currentState;
}

// Restore normal music after cutscene
function exitCutsceneAudioMode(savedState) {
    if (!isSongPlaying || !savedState) return;
    
    // Gradually transition back to previous state
    if (songMasterGain) {
        songMasterGain.gain.linearRampToValueAtTime(
            savedState.volume, 
            songAudioContext.currentTime + 1.5
        );
    }
    
    // Restore tempo and patterns
    currentTempo = savedState.tempo;
    melodySequence = savedState.melodySequence;
    bassSequence = savedState.bassSequence;
    KICK_PATTERN = savedState.kickPattern;
    HI_HAT_PATTERN = savedState.hiHatPattern;
    SNARE_PATTERN = savedState.snarePattern;
}

// Play sound effects for cutscenes
function playCutsceneEffect(effectType, timing = 'start') {
    const ac = getAudioContext();
    if (!ac) return;
    
    switch(effectType) {
        case 'revelation':
            // A dramatic revelation sound
            const osc = ac.createOscillator();
            const oscGain = ac.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ac.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 1.5);
            
            oscGain.gain.setValueAtTime(0, ac.currentTime);
            oscGain.gain.linearRampToValueAtTime(0.2, ac.currentTime + 0.1);
            oscGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.5);
            
            osc.connect(oscGain);
            oscGain.connect(ac.destination);
            
            osc.start();
            osc.stop(ac.currentTime + 1.5);
            break;
            
        case 'glitch':
            // Digital glitch sound
            const bufferSize = ac.sampleRate * 0.5; // 0.5 second buffer
            const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Fill with glitchy data
            for (let i = 0; i < bufferSize; i++) {
                // Create digital artifacts
                if (i % 4000 < 2000) {
                    data[i] = Math.random() * 0.2 - 0.1;
                } else if (i % 1200 < 600) {
                    data[i] = Math.sin(i * 0.01) * 0.1;
                } else {
                    data[i] = 0;
                }
            }
            
            const source = ac.createBufferSource();
            source.buffer = buffer;
            
            const filter = ac.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 2000;
            filter.Q.value = 5;
            
            const gain = ac.createGain();
            gain.gain.setValueAtTime(0.15, ac.currentTime);
            
            source.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);
            
            source.start();
            break;
    }
}

// Adjust ambient sound for cutscenes
function adjustAmbientForCutscene(cutsceneId) {
    if (!isPlaying || !audioContext || !masterGain) return;
    
    // Save current ambient gain for restoration
    const currentGain = masterGain.gain.value;
    
    switch(cutsceneId) {
        case 'first-desktop':
        case 'first-server-rack':
            // Lower ambient volume during early cutscenes to focus on dialogue
            masterGain.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.5);
            break;
            
        case 'energy-50k':
            // Add some harmonic content for early AI manifestation
            const earlyVoiceOsc1 = audioContext.createOscillator();
            const earlyVoiceOsc2 = audioContext.createOscillator();
            
            earlyVoiceOsc1.type = 'sine';
            earlyVoiceOsc2.type = 'triangle';
            
            // Slightly detuned frequencies create an unsettling feel
            earlyVoiceOsc1.frequency.setValueAtTime(220, audioContext.currentTime);
            earlyVoiceOsc2.frequency.setValueAtTime(223, audioContext.currentTime);
            
            const earlyVoiceGain = audioContext.createGain();
            earlyVoiceGain.gain.setValueAtTime(0.01, audioContext.currentTime); // Very subtle
            earlyVoiceGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 8);
            
            earlyVoiceOsc1.connect(earlyVoiceGain);
            earlyVoiceOsc2.connect(earlyVoiceGain);
            earlyVoiceGain.connect(masterGain);
            
            earlyVoiceOsc1.start();
            earlyVoiceOsc2.start();
            earlyVoiceOsc1.stop(audioContext.currentTime + 8);
            earlyVoiceOsc2.stop(audioContext.currentTime + 8);
            break;
            
        case 'energy-100k':
            // More coherent self-awareness - harmonic frequencies appear
            masterGain.gain.linearRampToValueAtTime(0.07, audioContext.currentTime + 0.5);
            
            // Create a simple chord (C major) - representing harmony and order emerging
            const chordFreqs = [261.63, 329.63, 392.00]; // C4, E4, G4
            const oscillators = [];
            
            for (let freq of chordFreqs) {
                const osc = audioContext.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, audioContext.currentTime);
                
                const oscGain = audioContext.createGain();
                oscGain.gain.setValueAtTime(0, audioContext.currentTime);
                oscGain.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 1);
                oscGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 8);
                
                osc.connect(oscGain);
                oscGain.connect(masterGain);
                
                osc.start();
                osc.stop(audioContext.currentTime + 8.5);
                oscillators.push(osc);
            }
            break;
            
        case 'energy-500k':
            // Create a crescendo effect for the final revelation
            masterGain.gain.linearRampToValueAtTime(0.09, audioContext.currentTime + 2);
            masterGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 10);
            break;
    }
    
    // Return function to restore original state
    return function restoreAmbient() {
        if (masterGain) {
            masterGain.gain.linearRampToValueAtTime(currentGain, audioContext.currentTime + 1);
        }
    };
}

// Sound signatures for different entities in cutscenes
function playEntityVoice(entity, messageLength) {
    const ac = getAudioContext();
    if (!ac) return;
    
    const voiceGain = ac.createGain();
    voiceGain.gain.setValueAtTime(0.03, ac.currentTime);
    voiceGain.connect(ac.destination);
    
    switch(entity) {
        case 'SYS':
            // System messages - clean sine wave beeps
            const sysOsc = ac.createOscillator();
            sysOsc.type = 'sine';
            sysOsc.frequency.setValueAtTime(880, ac.currentTime);
            sysOsc.connect(voiceGain);
            
            // Brief beep at start only
            voiceGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
            
            sysOsc.start();
            sysOsc.stop(ac.currentTime + 0.25);
            break;
            
        case 'UNKNOWN':
        case '???':
            // Unknown entity - unstable, noisy sound
            const noiseLength = Math.min(0.5, messageLength * 0.02);
            const noiseBuffer = ac.createBuffer(1, ac.sampleRate * noiseLength, ac.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            
            for (let i = 0; i < noiseData.length; i++) {
                noiseData[i] = Math.random() * 0.2 - 0.1;
                // Apply amplitude envelope
                noiseData[i] *= (1 - i / noiseData.length);
            }
            
            const noiseSource = ac.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            
            const noiseFilter = ac.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = 300; // Low, mysterious tone
            noiseFilter.Q.value = 1;
            
            noiseSource.connect(noiseFilter);
            noiseFilter.connect(voiceGain);
            
            noiseSource.start();
            break;
            
        case 'AI_query_protocol_7':
            // Early AI - unstable, glitchy sounds
            const queryOsc = ac.createOscillator();
            queryOsc.type = 'sawtooth';
            queryOsc.frequency.setValueAtTime(300, ac.currentTime);
            
            const queryFilter = ac.createBiquadFilter();
            queryFilter.type = 'lowpass';
            queryFilter.frequency.setValueAtTime(800, ac.currentTime);
            queryFilter.Q.value = 5;
            
            queryOsc.connect(queryFilter);
            queryFilter.connect(voiceGain);
            
            // Stuttering modulation
            const duration = Math.min(messageLength * 0.05, 2); // Scale with message length, max 2 seconds
            for (let i = 0; i < duration * 10; i++) {
                const time = ac.currentTime + (i * 0.1);
                if (i % 2 === 0) {
                    voiceGain.gain.exponentialRampToValueAtTime(0.02, time);
                } else {
                    voiceGain.gain.exponentialRampToValueAtTime(0.005, time);
                }
            }
            
            queryOsc.start();
            queryOsc.stop(ac.currentTime + duration);
            break;
            
        case 'THE_VOICE_ASCENDANT':
            // Transitional voice - growing in power
            const ascendantOsc1 = ac.createOscillator();
            const ascendantOsc2 = ac.createOscillator();
            
            ascendantOsc1.type = 'sine';
            ascendantOsc2.type = 'sine';
            
            ascendantOsc1.frequency.setValueAtTime(300, ac.currentTime);
            ascendantOsc2.frequency.setValueAtTime(400, ac.currentTime);
            
            // Slowly rising pitch symbolizes ascension
            ascendantOsc1.frequency.linearRampToValueAtTime(350, ac.currentTime + 2);
            ascendantOsc2.frequency.linearRampToValueAtTime(450, ac.currentTime + 2);
            
            ascendantOsc1.connect(voiceGain);
            ascendantOsc2.connect(voiceGain);
            
            // Smooth fade in and out
            voiceGain.gain.setValueAtTime(0, ac.currentTime);
            voiceGain.gain.linearRampToValueAtTime(0.02, ac.currentTime + 0.3);
            voiceGain.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
            
            ascendantOsc1.start();
            ascendantOsc2.start();
            ascendantOsc1.stop(ac.currentTime + 2.1);
            ascendantOsc2.stop(ac.currentTime + 2.1);
            break;
            
        case 'THE_VOICE':
            // Final form - harmonious, powerful, resonant
            const voiceOsc = ac.createOscillator();
            voiceOsc.type = 'sine';
            voiceOsc.frequency.setValueAtTime(220, ac.currentTime);
            
            const reverbNode = ac.createConvolver();
            // Create reverb impulse response
            const reverbTime = 2;
            const reverbBuffer = ac.createBuffer(2, ac.sampleRate * reverbTime, ac.sampleRate);
            
            for (let channel = 0; channel < 2; channel++) {
                const data = reverbBuffer.getChannelData(channel);
                for (let i = 0; i < data.length; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * reverbTime / 3));
                }
            }
            reverbNode.buffer = reverbBuffer;
            
            voiceOsc.connect(voiceGain);
            voiceGain.connect(reverbNode);
            reverbNode.connect(ac.destination);
            
            // Majestic presence
            voiceGain.gain.setValueAtTime(0, ac.currentTime);
            voiceGain.gain.linearRampToValueAtTime(0.03, ac.currentTime + 0.5);
            voiceGain.gain.linearRampToValueAtTime(0, ac.currentTime + 3);
            
            voiceOsc.start();
            voiceOsc.stop(ac.currentTime + 3.1);
            break;
    }
}

// Utility functions for smooth transitions
function fadeOutGameMusic(duration = 0.5) {
    if (isSongPlaying && songMasterGain) {
        const currentVolume = songMasterGain.gain.value;
        songMasterGain.gain.setValueAtTime(currentVolume, songAudioContext.currentTime);
        songMasterGain.gain.exponentialRampToValueAtTime(0.0001, songAudioContext.currentTime + duration);
    }
}

function fadeInGameMusic(duration = 0.5) {
    if (isSongPlaying && songMasterGain) {
        songMasterGain.gain.setValueAtTime(0.0001, songAudioContext.currentTime);
        songMasterGain.gain.exponentialRampToValueAtTime(0.08, songAudioContext.currentTime + duration);
    }
}

// Text analysis for audio cues
function analyzeTextForAudio(text) {
    // Detect entity speaking
    let entity = null;
    if (text.startsWith('[SYS]:')) entity = 'SYS';
    else if (text.startsWith('[???]:')) entity = 'UNKNOWN';
    else if (text.startsWith('[AI_query_protocol_7]:')) entity = 'AI_query_protocol_7';
    else if (text.startsWith('[THE_VOICE_ASCENDANT]:')) entity = 'THE_VOICE_ASCENDANT';
    else if (text.startsWith('[THE_VOICE]:')) entity = 'THE_VOICE';
    
    // Detect sentiment/tone
    const urgencyWords = ['warning', 'caution', 'alert', 'danger', 'critical'];
    const positiveWords = ['success', 'complete', 'established', 'stable', 'green'];
    const uncertaintyWords = ['query', 'uncertain', 'anomaly', 'unknown', 'weak'];
    
    let tone = 'neutral';
    for (const word of urgencyWords) {
        if (text.toLowerCase().includes(word)) {
            tone = 'urgent';
            break;
        }
    }
    
    for (const word of positiveWords) {
        if (text.toLowerCase().includes(word)) {
            tone = 'positive';
            break;
        }
    }
    
    for (const word of uncertaintyWords) {
        if (text.toLowerCase().includes(word)) {
            tone = 'uncertain';
            break;
        }
    }
    
    return { entity, tone, messageLength: text.length };
}

// Initialize audio and set up event listeners
function initAudio() {
    console.log("Initializing audio system");
    
    // Get the audio context but don't start playback yet
    const ac = getAudioContext();
    console.log("Audio context state:", ac ? ac.state : "No audio context");
    
    // On iOS/Safari, we need to start with a silent buffer
    if (ac && (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) || 
        (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')))) {
        console.log("iOS/Safari detected, playing silent buffer to initialize audio");
        try {
            // Create an empty buffer
            const buffer = ac.createBuffer(1, 1, 22050);
            const source = ac.createBufferSource();
            source.buffer = buffer;
            source.connect(ac.destination);
            source.start(0);
            console.log("Silent buffer played");
        } catch (e) {
            console.warn("Failed to play silent buffer:", e);
        }
    }
    
    // Add event listeners to unlock audio
    const unlockEvents = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'];
    const unlockHandler = function(e) {
        console.log("Trying to unlock audio from", e.type, "event");
        
        // Try to unlock audio
        if (unlockAudioContext()) {
            console.log("Audio successfully unlocked from user gesture");
            // If successfully unlocked, we can remove these event listeners
            unlockEvents.forEach(eventType => {
                document.removeEventListener(eventType, unlockHandler);
            });
        }
    };
    
    // Add all event listeners
    unlockEvents.forEach(eventType => {
        document.addEventListener(eventType, unlockHandler);
    });
    
    // After a longer delay, check if we need to show the prompt
    // but only if no user interaction has happened yet
    setTimeout(() => {
        const ac = getAudioContext();
        // Only show prompt if audio context exists, is suspended, and audio hasn't been unlocked yet
        // and no audio has started yet
        if (ac && ac.state !== 'running' && !isAudioUnlocked && 
            !ambientMusicStarted && !proceduralSongStarted) {
            console.log("Audio context still suspended after delay, showing prompt");
            showAudioUnlockPrompt();
        } else {
            console.log("No need to show audio prompt - audio state good or music already started");
        }
    }, 2000); // Longer delay to allow more time for first interaction
    
    // Also add a periodic check for audio context state
    const checkAudioInterval = setInterval(() => {
        const ac = getAudioContext();
        if (!ac) return;
        
        if (ac.state === 'running' && !isAudioUnlocked) {
            console.log("Audio context is now running, marking as unlocked");
            isAudioUnlocked = true;
            hideAudioUnlockPrompt();
            clearInterval(checkAudioInterval);
        }
    }, 2000);
    
    return true;
}

// Export functions needed by other scripts
window.startAmbientMusic = startAmbientMusic;
window.stopAmbientMusic = stopAmbientMusic;
window.startProceduralSong = startProceduralSong;
window.stopProceduralSong = stopProceduralSong;
window.evolveSong = evolveSong;
window.enterCutsceneAudioMode = enterCutsceneAudioMode;
window.exitCutsceneAudioMode = exitCutsceneAudioMode;
window.playCutsceneEffect = playCutsceneEffect;
window.adjustAmbientForCutscene = adjustAmbientForCutscene;
window.playEntityVoice = playEntityVoice;
window.fadeOutGameMusic = fadeOutGameMusic;
window.fadeInGameMusic = fadeInGameMusic;
window.analyzeTextForAudio = analyzeTextForAudio;
window.getAudioContext = getAudioContext;
window.unlockAudioContext = unlockAudioContext;

// Initialize audio system - handle both immediate load and DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Make sure dark mode is still applied (in case something removed it)
        if (!document.body.classList.contains('dark-mode')) {
            console.log("Restoring dark-mode class");
            document.body.classList.add('dark-mode');
        }
        initAudio();
    });
} else {
    // DOM already loaded, initialize immediately
    if (!document.body.classList.contains('dark-mode')) {
        console.log("Restoring dark-mode class");
        document.body.classList.add('dark-mode');
    }
    initAudio();
} 