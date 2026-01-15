// ============================================
// DOM GLOBALS - HTML elements we interact with
// ============================================
const controls = document.querySelector(".controls");
const showControls = document.querySelector("#createContext");
const lfoControls = document.querySelector("#lfoModulation");
const recordBtn = document.querySelector("#record");
const downloadLink = document.querySelector("#downloadRecording");

// SVGs created using -> https://github.com/Yqnn/svg-path-editor
const waveSVG = {
  sine: () => `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 9 C 6 1, 12 1, 18 9 S 30 17, 36 9 S 44 1, 50 9" fill="none" stroke="currentColor" stroke-width="2"></svg>`,
  triangle: () => `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 16 L12 2 L25 16 L38 2 L50 16" fill="none" stroke="currentColor" stroke-width="2"></svg>`,
  square: () => `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 16 L0 2 L12 2 L12 16 L25 16 L25 2 L38 2 L38 16 L50 16" fill="none" stroke="currentColor" stroke-width="2"></svg>`,
  sawtooth: () => `<svg width="50" height="18" viewBox="0 0 50 18"><path d="M0 16 L12 2 L12 16 L25 2 L25 16 L38 2 L38 16 L50 2" fill="none" stroke="currentColor" stroke-width="2"></svg>`
};

controls.style.display = "none";

// ============================================
// SYNTH GLOBALS - Web Audio API objects
// ============================================
let audioContext, oscillator, gainNode, vcaGain, mediaDest, mediaRecorder;
let recordedChunks = [], isRecording = false;
let lfo, lfoGain, lfoEnabled = false, lfoToGainDepth, lfoToFreqDepth, baseGainSource, baseFreqSource;

// ============================================
// INITIALIZE AUDIO CONTEXT
// ============================================
showControls.addEventListener("click", initializeAudioContext);

// ============================================
// RECORDING FUNCTIONALITY
// ============================================
recordBtn.addEventListener("click", toggleRecording);

// ============================================
// PLAY AUDIO - Start the oscillator
// ============================================
document.querySelector("#play").addEventListener("click", playAudio);

// ============================================
// PAUSE AUDIO - Stop the oscillator
// ============================================
document.querySelector("#pause").addEventListener("click", pauseAudio);

// ============================================
// OSCILLATOR CONTROLS
// ============================================
document.querySelector("#waveType").addEventListener("change", changeWaveform);
document.querySelector("#frequency").addEventListener("input", changeFrequency);
document.querySelector("#gain").addEventListener("input", changeGain);

// ============================================
// LFO CONTROLS
// ============================================
document.querySelector("#lfoToggle").addEventListener("change", toggleLFO);
document.querySelector("#lfoType").addEventListener("change", changeLFOType);
document.querySelector("#lfoRate").addEventListener("input", changeLFORate);
document.querySelector("#lfoGain").addEventListener("change", updateLFORouting);
document.querySelector("#lfoFreq").addEventListener("change", updateLFORouting);

// ============================================
// INITIALIZE AUDIO CONTEXT FUNCTION
// ============================================
function initializeAudioContext() {
  controls.style.display = controls.style.display === "none" ? "block" : "none";
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    vcaGain = audioContext.createGain();
    mediaDest = audioContext.createMediaStreamDestination();
    setupAudioRouting();
    document.querySelector("#record").disabled = false;
    showControls.disabled = true;
    showControls.style.opacity = "0.5";
    showControls.style.cursor = "not-allowed";
  }
}

// ============================================
// SETUP AUDIO ROUTING FUNCTION
// ============================================
function setupAudioRouting() {
  gainNode.connect(vcaGain);
  vcaGain.connect(audioContext.destination);
  vcaGain.connect(mediaDest);
}

// ============================================
// TOGGLE RECORDING FUNCTION
// ============================================
function toggleRecording() {
  if (!audioContext || !mediaDest) return;
  downloadLink.style.display = "none";
  downloadLink.removeAttribute("href");
  isRecording ? stopRecording() : startRecording();
}

// ============================================
// START RECORDING FUNCTION
// ============================================
function startRecording() {
  recordedChunks = [];
  const options = { mimeType: getSupportedMimeType() };
  mediaRecorder = new MediaRecorder(mediaDest.stream, options);
  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
  mediaRecorder.onstop = createDownloadLink;
  mediaRecorder.start();
  isRecording = true;
  recordBtn.textContent = "Stop Recording";
}

// ============================================
// STOP RECORDING FUNCTION
// ============================================
function stopRecording() {
  mediaRecorder.stop();
  isRecording = false;
  recordBtn.textContent = "Start Recording";
}

// ============================================
// CREATE DOWNLOAD LINK FUNCTION
// ============================================
function createDownloadLink() {
  const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || "audio/webm" });
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = "recording.webm";
  downloadLink.textContent = "Download Recording";
  downloadLink.style.display = "inline-block";
  console.log(blob);
}

// ============================================
// GET SUPPORTED MIME TYPE FUNCTION (for MediaRecorder options)
// ============================================
function getSupportedMimeType() {
  const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
  for (const type of preferredTypes) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
}

// ============================================
// PLAY AUDIO FUNCTION
// ============================================
function playAudio() {
  if (!oscillator) {
    oscillator = audioContext.createOscillator();
    const waveType = document.querySelector("#waveType").value;
    oscillator.type = ['sine', 'square', 'sawtooth', 'triangle'].includes(waveType) ? waveType : 'sine';
    oscillator.frequency.value = document.querySelector("#frequency").value;
    oscillator.connect(gainNode);
    oscillator.start();
    if (lfoEnabled) createLFO();
  }
}

// ============================================
// PAUSE AUDIO FUNCTION
// ============================================
function pauseAudio() {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
  stopLFO();
}

// ============================================
// CHANGE WAVEFORM FUNCTION
// ============================================
function changeWaveform(e) {
  if (oscillator) oscillator.type = e.target.value;
}

// ============================================
// CHANGE FREQUENCY FUNCTION
// ============================================
function changeFrequency(e) {
  const val = parseFloat(e.target.value);
  if (oscillator) oscillator.frequency.value = val;
  if (baseFreqSource) baseFreqSource.offset.value = val;
}

// ============================================
// CHANGE GAIN FUNCTION
// ============================================
function changeGain(e) {
  gainNode.gain.value = parseFloat(e.target.value);
}

// ============================================
// TOGGLE LFO FUNCTION AND DISPLAY (and enable LFO)
// ============================================
function toggleLFO(e) {
  lfoEnabled = e.target.checked;
  lfoControls.style.display = lfoEnabled ? "block" : "none";
  if (lfoEnabled && oscillator) createLFO();
  else stopLFO();
}

// ============================================
// CHANGE LFO TYPE FUNCTION
// ============================================
function changeLFOType(e) {
  if (lfo) lfo.type = e.target.value;
}

// ============================================
// CHANGE LFO RATE FUNCTION
// ============================================
function changeLFORate(e) {
  if (lfo) lfo.frequency.value = e.target.value;
}

// ============================================
// CREATE LFO FUNCTION
// ============================================
function createLFO() {
  if (!audioContext || !oscillator || !gainNode) return;
  stopLFO();
  lfo = audioContext.createOscillator();
  lfo.type = document.querySelector("#lfoType").value;
  lfo.frequency.value = parseFloat(document.querySelector("#lfoRate").value);
  setupLFOGainAndFrequency();
  startLFO();
}

// ============================================
// SETUP LFO GAIN AND FREQUENCY FUNCTION
// ============================================
function setupLFOGainAndFrequency() {
  lfoToGainDepth = audioContext.createGain();
  lfoToFreqDepth = audioContext.createGain();
  lfoToGainDepth.gain.value = 0.4;
  lfoToFreqDepth.gain.value = 30;
  baseGainSource = audioContext.createConstantSource();
  baseFreqSource = audioContext.createConstantSource();
  baseGainSource.offset.value = parseFloat(document.querySelector("#gain").value) || 0.1;
  baseFreqSource.offset.value = parseFloat(document.querySelector("#frequency").value) || 220;
  lfo.connect(lfoToGainDepth);
  lfo.connect(lfoToFreqDepth);
  updateLFORouting();
}

// ============================================
// START LFO FUNCTION
// ============================================
function startLFO() {
  baseGainSource.start();
  baseFreqSource.start();
  lfo.start();
}

// ============================================
// UPDATE LFO ROUTING FUNCTION
// ============================================
function updateLFORouting() {
  if (!lfo || !gainNode) return;
  if (baseGainSource) baseGainSource.disconnect();
  if (lfoToGainDepth) lfoToGainDepth.disconnect();
  if (document.querySelector("#lfoGain").checked) {
    baseGainSource.connect(vcaGain.gain);
    lfoToGainDepth.connect(vcaGain.gain);
  }
  if (oscillator) {
    if (baseFreqSource) baseFreqSource.disconnect();
    if (lfoToFreqDepth) lfoToFreqDepth.disconnect();
    if (document.querySelector("#lfoFreq").checked) {
      baseFreqSource.connect(oscillator.frequency);
      lfoToFreqDepth.connect(oscillator.frequency);
    }
  }
}

// ============================================
// STOP LFO FUNCTION
// ============================================
function stopLFO() {
  if (lfo) {
    lfo.stop();
    lfo.disconnect();
    lfo = null;
  }
  if (lfoToGainDepth) lfoToGainDepth.disconnect();
  if (lfoToFreqDepth) lfoToFreqDepth.disconnect();
  lfoToGainDepth = null;
  lfoToFreqDepth = null;
  if (baseGainSource) {
    baseGainSource.stop();
    baseGainSource.disconnect();
    baseGainSource = null;
  }
  if (baseFreqSource) {
    baseFreqSource.stop();
    baseFreqSource.disconnect();
    baseFreqSource = null;
  }
}

// ============================================
// WAVEFORM ICON FUNCTIONS - Display wave visuals
// ============================================
function setWaveIcon(containerEl, waveType) {
  const fn = waveSVG[waveType] || waveSVG.sine;
  containerEl.innerHTML = fn();
}

// Set initial oscillator icon
const oscWaveIcon = document.querySelector("#oscWaveIcon");
setWaveIcon(oscWaveIcon, document.querySelector("#waveType").value);

// Update oscillator icon when waveform changes
document.querySelector("#waveType").addEventListener("change", (e) => {
  const type = e.target.value;
  setWaveIcon(oscWaveIcon, type);
  if (oscillator) oscillator.type = type;
});

// Set initial LFO icon
const lfoWaveIcon = document.querySelector("#lfoWaveIcon");
setWaveIcon(lfoWaveIcon, document.querySelector("#lfoType").value);

// Update LFO icon when waveform changes
document.querySelector("#lfoType").addEventListener("change", (e) => {
  const type = e.target.value;
  setWaveIcon(lfoWaveIcon, type);
  if (lfo) lfo.type = type;
});
