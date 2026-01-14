// DOM Globals
const controls = document.querySelector(".controls");
const showControls = document.querySelector("#createContext");
controls.style.display = "none";
const lfoControls = document.querySelector("#lfoModulation");
lfoControls.style.display = "none";

// Synth Globals
let audioContext;
let oscillator;
let gainNode;
let vcaGain;

// Modulation Globals
let lfo;
let lfoGain;
let lfoEnabled = false;
let lfoToGainDepth;
let lfoToFreqDepth;
let baseGainSource;
let baseFreqSource;

// Record Globals
let mediaDest;
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
const recordBtn = document.querySelector("#record");
const downloadLink = document.querySelector("#downloadRecording");

// Wavetype SVGs
const waveSVG = {
  sine: () => `
    <svg width="50" height="18" viewBox="0 0 50 18">
      <path d="M0 9 C 6 1, 12 1, 18 9 S 30 17, 36 9 S 44 1, 50 9"
            fill="none" stroke="currentColor" stroke-width="2">
    </svg>`,

  triangle: () => `
    <svg width="50" height="18" viewBox="0 0 50 18">
      <path d="M0 16 L12 2 L25 16 L38 2 L50 16"
            fill="none" stroke="currentColor" stroke-width="2">
    </svg>`,

  square: () => `
    <svg width="50" height="18" viewBox="0 0 50 18">
      <path d="M0 16 L0 2 L12 2 L12 16 L25 16 L25 2 L38 2 L38 16 L50 16"
            fill="none" stroke="currentColor" stroke-width="2">
    </svg>`,

  sawtooth: () => `
    <svg width="50" height="18" viewBox="0 0 50 18">
      <path d="M0 16 L12 2 L12 16 L25 2 L25 16 L38 2 L38 16 L50 2"
            fill="none" stroke="currentColor" stroke-width="2">
    </svg>`
};

// Create Audio Context and Gain Node
showControls.addEventListener("click", () => {
  // Toggle UI
  controls.style.display = controls.style.display === "none" ? "block" : "none";

  // Initialize AudioContext ONCE
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    gainNode = audioContext.createGain();
    vcaGain = audioContext.createGain();

    gainNode.connect(vcaGain);
    vcaGain.connect(audioContext.destination);

    // Recorder destination
    mediaDest = audioContext.createMediaStreamDestination();
    vcaGain.connect(mediaDest);

    gainNode.gain.value = 0.1;
    vcaGain.gain.value = 1.0;

    // Enable record button
    document.querySelector("#record").disabled = false;

    showControls.disabled = true;
    showControls.style.opacity = "0.5";
    showControls.style.cursor = "not-allowed";
  }
});

// Record Audio
recordBtn.addEventListener("click", () => {
  if (!audioContext || !mediaDest) return;

  // Hide any previous download link when starting a new recording
  downloadLink.style.display = "none";
  downloadLink.removeAttribute("href");

  if (!isRecording) {
    recordedChunks = [];

    // Pick a supported mimeType if possible
    let options = {};
    const preferredTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus"
    ];

    for (const type of preferredTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        options.mimeType = type;
        break;
      }
    }

    mediaRecorder = new MediaRecorder(mediaDest.stream, options);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || "audio/webm" });
      const url = URL.createObjectURL(blob);

      downloadLink.href = url;
      downloadLink.download = "recording.webm";
      downloadLink.textContent = "Download Recording";
      downloadLink.style.display = "inline-block";
    };

    mediaRecorder.start();
    isRecording = true;
    recordBtn.textContent = "Stop Recording";
  } else {
    mediaRecorder.stop();
    isRecording = false;
    recordBtn.textContent = "Start Recording";
  }
});

// Start Audio
document.querySelector("#play").addEventListener("click", () => {
    if (!oscillator) {
        oscillator = audioContext.createOscillator();
        const waveType = document.querySelector("#waveType").value;
        const validWaveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
        oscillator.type = validWaveTypes.includes(waveType) ? waveType : 'sine';
        oscillator.frequency.value = document.querySelector("#frequency").value;
        oscillator.connect(gainNode);
        oscillator.start();
        
        if (lfoEnabled) createLFO();
    }
});

// Pause Audio
document.querySelector("#pause").addEventListener("click", () => {
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
    stopLFO();
});

// Oscillator selection
document.querySelector("#waveType").addEventListener("change", (e) => {
    if (oscillator) oscillator.type = e.target.value;
});

// Frequency slider
document.querySelector("#frequency").addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  if (oscillator) oscillator.frequency.value = val; // fallback
  if (baseFreqSource) baseFreqSource.offset.value = val;
});

// Gain (volume) slide
document.querySelector("#gain").addEventListener("input", (e) => {
  const val = parseFloat(e.target.value);
  gainNode.gain.value = val;
});

// LFO Toggle Checkbox (on/off)
document.querySelector("#lfoToggle").addEventListener("change", (e) => {
  lfoEnabled = e.target.checked;

  // Show / hide LFO controls
  lfoControls.style.display = lfoEnabled ? "block" : "none";

  if (lfoEnabled && oscillator) {
    createLFO();
  } else {
    stopLFO();
  }
});

// LFO Type
document.querySelector("#lfoType").addEventListener("change", (e) => {
  if (lfo) {
    lfo.type = e.target.value;
  }
});

// LFO Rate Slider
document.querySelector("#lfoRate").addEventListener("input", (e) => {
    if (lfo) lfo.frequency.value = e.target.value;
});

// LFO Gain Checkbox
document.querySelector("#lfoGain").addEventListener("change", () => {
  updateLFORouting();
});

// LFO Frequency Checkbox
document.querySelector("#lfoFreq").addEventListener("change", () => {
  updateLFORouting();
});

function createLFO() {
  if (!audioContext || !oscillator || !gainNode) return;

  // If an LFO already exists, kill it first (prevents stacking)
  stopLFO();

  // LFO oscillator (bipolar: -1..+1)
  lfo = audioContext.createOscillator();
  const lfoTypeSelect = document.querySelector("#lfoType");
  lfo.type = lfoTypeSelect ? lfoTypeSelect.value : "sine";

  lfo.frequency.value = parseFloat(document.querySelector("#lfoRate").value);

  // Depth nodes (separate for gain/frequency)
  lfoToGainDepth = audioContext.createGain();
  lfoToFreqDepth = audioContext.createGain();

  // Good starting depths:
  // - gain depth should be small (0.0 - 0.5-ish)
  // - frequency depth can be larger (in Hz)
  lfoToGainDepth.gain.value = 0.4; // try 0.02–0.2
  lfoToFreqDepth.gain.value = 30;   // try 5–200 Hz

  // Base sources (slider sets these)
  baseGainSource = audioContext.createConstantSource();
  baseFreqSource = audioContext.createConstantSource();

  baseGainSource.offset.value = parseFloat(document.querySelector("#gain").value) || 0.1;
  baseFreqSource.offset.value = parseFloat(document.querySelector("#frequency").value) || 220;

  // Route LFO into the depth scalers
  lfo.connect(lfoToGainDepth);
  lfo.connect(lfoToFreqDepth);

  if (document.querySelector("#lfoGain").checked) {
    // Make tremolo go from (1 - depth) to (1 + depth)
    // We do that by setting a constant offset of 1, plus the LFO scaled by depth.
    baseGainSource.offset.value = 1.0;       // acts as "center" (no tremolo = 1)
    lfoToGainDepth.gain.value = 0.5;         // depth (try 0.1 to 0.9)

    baseGainSource.connect(vcaGain.gain);
    lfoToGainDepth.connect(vcaGain.gain);
  }

  // Frequency
  if (document.querySelector("#lfoFreq").checked) {
    baseFreqSource.connect(oscillator.frequency);
    lfoToFreqDepth.connect(oscillator.frequency);
  }

  baseGainSource.start();
  baseFreqSource.start();
  lfo.start();
  updateLFORouting();

}

function updateLFORouting() {
  // Only do work if LFO graph exists
  if (!lfo || !gainNode) return;

  // ---- GAIN routing ----
  // Disconnect gain mod routes first (safe even if not connected)
  if (baseGainSource) baseGainSource.disconnect();
  if (lfoToGainDepth) lfoToGainDepth.disconnect();

  if (document.querySelector("#lfoGain").checked) {
    baseGainSource.connect(vcaGain.gain);
    lfoToGainDepth.connect(vcaGain.gain);
  }


  // ---- FREQ routing ----
  if (oscillator) {
    if (baseFreqSource) baseFreqSource.disconnect();
    if (lfoToFreqDepth) lfoToFreqDepth.disconnect();

    if (document.querySelector("#lfoFreq").checked) {
      baseFreqSource.connect(oscillator.frequency);
      lfoToFreqDepth.connect(oscillator.frequency);
    }
  }
}

function stopLFO() {
  if (lfo) {
    try { lfo.stop(); } catch {}
    lfo.disconnect();
    lfo = null;
  }

  [lfoToGainDepth, lfoToFreqDepth].forEach(n => {
    if (n) { n.disconnect(); }
  });
  lfoToGainDepth = null;
  lfoToFreqDepth = null;

  [baseGainSource, baseFreqSource].forEach(s => {
    if (s) {
      try { s.stop(); } catch {}
      s.disconnect();
    }
  });
  baseGainSource = null;
  baseFreqSource = null;
}

function setWaveIcon(containerEl, waveType) {
  const fn = waveSVG[waveType] || waveSVG.sine;
  containerEl.innerHTML = fn();
}

// Set Oscillator SVGs
const oscWaveIcon = document.querySelector("#oscWaveIcon");
setWaveIcon(oscWaveIcon, document.querySelector("#waveType").value);

document.querySelector("#waveType").addEventListener("change", (e) => {
  const type = e.target.value;
  setWaveIcon(oscWaveIcon, type);
  if (oscillator) oscillator.type = type;
});

const lfoWaveIcon = document.querySelector("#lfoWaveIcon");
setWaveIcon(lfoWaveIcon, document.querySelector("#lfoType").value);

document.querySelector("#lfoType").addEventListener("change", (e) => {
  const type = e.target.value;
  setWaveIcon(lfoWaveIcon, type);
  if (lfo) lfo.type = type;
});





