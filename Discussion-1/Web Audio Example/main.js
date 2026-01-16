// Grab DOM elements
const controls = document.querySelector(".controls");
const createBtn = document.querySelector("#createContext");

const playBtn = document.querySelector("#play");
const pauseBtn = document.querySelector("#pause");

const waveSelect = document.querySelector("#waveType");
const freqSlider = document.querySelector("#frequency");
const gainSlider = document.querySelector("#gain");

const lfoToggle = document.querySelector("#lfoToggle");
const lfoControls = document.querySelector("#lfoModulation");
const lfoTypeSelect = document.querySelector("#lfoType");
const lfoRateSlider = document.querySelector("#lfoRate");
const lfoGainCheck = document.querySelector("#lfoGain");
const lfoFreqCheck = document.querySelector("#lfoFreq");

const oscWaveIcon = document.querySelector("#oscWaveIcon");
const lfoWaveIcon = document.querySelector("#lfoWaveIcon");

// Hide UI at start
controls.style.display = "none";
lfoControls.style.display = "none";

// Web Audio globals
let audioContext = null;
let osc = null;
let amp = null;

let lfo = null;
let lfoToGain = null; // depth for gain modulation
let lfoToFreq = null; // depth for freq modulation

// SVG icons
const waveSVG = {
  sine: `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 9 C 6 1, 12 1, 18 9 S 30 17, 36 9 S 44 1, 50 9" fill="none" stroke="currentColor" stroke-width="2"></svg>`,
  triangle: `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 16 L12 2 L25 16 L38 2 L50 16" fill="none" stroke="currentColor" stroke-width="2"></svg>`,
  square: `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 16 L0 2 L12 2 L12 16 L25 16 L25 2 L38 2 L38 16 L50 16" fill="none" stroke="currentColor" stroke-width="2"></svg>`,
  sawtooth: `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 16 L12 2 L12 16 L25 2 L25 16 L38 2 L38 16 L50 2" fill="none" stroke="currentColor" stroke-width="2"></svg>`
};

// Set Icon next to wave type
function setWaveIcon(containerEl, waveType) {
  if (waveType === "sine") containerEl.innerHTML = waveSVG.sine;
  else if (waveType === "square") containerEl.innerHTML = waveSVG.square;
  else if (waveType === "triangle") containerEl.innerHTML = waveSVG.triangle;
  else if (waveType === "sawtooth") containerEl.innerHTML = waveSVG.sawtooth;
}

// set initial icons
setWaveIcon(oscWaveIcon, waveSelect.value);
setWaveIcon(lfoWaveIcon, lfoTypeSelect.value);

// Create Audio Context
createBtn.addEventListener("click", () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // show synth controls
  controls.style.display = "block";

  // LFO module only shows if checkbox is checked
  lfoControls.style.display = lfoToggle.checked ? "block" : "none";

  // disable create button so you can't hide controls by clicking again
  createBtn.disabled = true;
  createBtn.style.opacity = "0.5";
  createBtn.style.cursor = "not-allowed";
});

// Play button
playBtn.addEventListener("click", () => {
  if (!audioContext) return; // context must be created first
  if (osc) return; // already playing

  // create oscillator + amp
  osc = audioContext.createOscillator();
  amp = audioContext.createGain();

  // set values from UI
  osc.type = waveSelect.value;
  osc.frequency.value = parseFloat(freqSlider.value);
  amp.gain.value = parseFloat(gainSlider.value);

  // connect graph: osc -> amp -> speakers
  osc.connect(amp);
  amp.connect(audioContext.destination);

  // start
  osc.start();

  // if LFO enabled, start it
  if (lfoToggle.checked) {
    startLFO();
  }
});

// Pause button (does not terminate audio context)
pauseBtn.addEventListener("click", () => {
  stopSound();
});

// Wave selection
waveSelect.addEventListener("change", () => {
  setWaveIcon(oscWaveIcon, waveSelect.value);
  if (osc) osc.type = waveSelect.value;
});

// Frequency slider
freqSlider.addEventListener("input", () => {
  if (osc) osc.frequency.value = parseFloat(freqSlider.value);
});

// Gain (volume) slider
gainSlider.addEventListener("input", () => {
  if (amp) amp.gain.value = parseFloat(gainSlider.value);
});

// LFO controls toggle (checkbox)
lfoToggle.addEventListener("change", () => {
  lfoControls.style.display = lfoToggle.checked ? "block" : "none";

  if (!osc) return; // only run LFO if sound is playing

  if (lfoToggle.checked) startLFO();
  else stopLFO();
});

// LFO wave type selection
lfoTypeSelect.addEventListener("change", () => {
  setWaveIcon(lfoWaveIcon, lfoTypeSelect.value);
  if (lfo) lfo.type = lfoTypeSelect.value;
});

// LFO frequency slider (speed)
lfoRateSlider.addEventListener("input", () => {
  if (lfo) lfo.frequency.value = parseFloat(lfoRateSlider.value);
});

// Route to gain checkbox
lfoGainCheck.addEventListener("change", () => {
  if (lfo) updateLFORouting();
});

// Route to frequency checkbox
lfoFreqCheck.addEventListener("change", () => {
  if (lfo) updateLFORouting();
});

// LFO helpers
function startLFO() {
  // clear any old LFO first (don't want multiple LFOs at same time)
  stopLFO();

  // If any of these do not exist, stop the function
  if (!audioContext || !osc || !amp) return;

  lfo = audioContext.createOscillator();
  lfo.type = lfoTypeSelect.value;
  lfo.frequency.value = parseFloat(lfoRateSlider.value);

  // Depth/Intensity of modulation nodes (how strong the modulation is)
  lfoToGain = audioContext.createGain();
  lfoToFreq = audioContext.createGain();

  // simple “depth” values
  lfoToGain.gain.value = 0.4;  // gain wiggle amount
  lfoToFreq.gain.value = 30;   // frequency wiggle amount

  // connect LFO to depth nodes
  lfo.connect(lfoToGain);
  lfo.connect(lfoToFreq);

  // connect to targets based on checkboxes
  updateLFORouting();

  lfo.start();
}

function updateLFORouting() {
  if (!lfo || !lfoToGain || !lfoToFreq) return;

  // disconnect first so you don’t stack connections
  lfoToGain.disconnect();
  lfoToFreq.disconnect();

  // if checked, connect to the AudioParam
  if (lfoGainCheck.checked && amp) {
    lfoToGain.connect(amp.gain);
  }

  if (lfoFreqCheck.checked && osc) {
    lfoToFreq.connect(osc.frequency);
  }
}

function stopLFO() {
  if (lfo) {
    lfo.stop();
    lfo.disconnect();
    lfo = null;
  }

  if (lfoToGain) {
    lfoToGain.disconnect();
    lfoToGain = null;
  }

  if (lfoToFreq) {
    lfoToFreq.disconnect();
    lfoToFreq = null;
  }
}

function stopSound() {
  // stop LFO first
  stopLFO();

  // stop oscillator
  if (osc) {
    osc.stop();
    osc.disconnect();
    osc = null;
  }

  // clean amp
  if (amp) {
    amp.disconnect();
    amp = null;
  }
}
