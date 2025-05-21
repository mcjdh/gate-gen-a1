// Procedural Sound Generation for Gateway Protocol

console.log("sound.js loaded");

let audioContext = null;
let masterGain = null;
let isPlaying = false;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function startAmbientMusic() {
    if (isPlaying) return;
    const ac = getAudioContext();
    if (!ac) {
        console.warn("Web Audio API not supported or context failed to initialize.");
        return;
    }

    // Ensure context is running (especially after user interaction)
    if (ac.state === 'suspended') {
        ac.resume();
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
    if (songAudioContext.state === 'suspended') {
        songAudioContext.resume();
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