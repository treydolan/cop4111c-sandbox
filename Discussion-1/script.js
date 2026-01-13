"use strict";

let ctx = null;
let masterGain = null;
let filter = null;

const startBtn = document.getElementById("startBtn");
const playBtn = document.getElementById("playBtn");

const waveSel = document.getElementById("wave");
const freq = document.getElementById("freq");
const vol = document.getElementById("vol");
const cutoff = document.getElementById("cutoff");

const freqVal = document.getElementById("freqVal");
const volVal = document.getElementById("volVal");
const cutVal = document.getElementById("cutVal");

function setTextOutputs() {
  freqVal.textContent = String(freq.value);
  volVal.textContent = Number(vol.value).toFixed(2);
  cutVal.textContent = String(cutoff.value);
}

setTextOutputs();

function ensureAudio() {
  if (ctx) return;

  // AudioContext is the main entry point of the Web Audio API
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  // Master volume
  masterGain = ctx.createGain();
  masterGain.gain.value = Number(vol.value);

  // Simple low-pass filter
  filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = Number(cutoff.value);

  // Route: Oscillator -> Filter -> Gain -> Speakers
  filter.connect(masterGain);
  masterGain.connect(ctx.destination);
}

async function startAudio() {
  ensureAudio();

  // Some browsers start suspended until resumed from a gesture
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  playBtn.disabled = false;
  startBtn.disabled = true;
  startBtn.textContent = "Audio Started";
}

function playNote() {
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = waveSel.value;
  osc.frequency.setValueAtTime(Number(freq.value), now);

  // Envelope via gain automation (prevents clicks)
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, masterGain.gain.value), now + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  osc.connect(amp);
  amp.connect(filter);

  osc.start(now);
  osc.stop(now + 0.4);

  osc.onended = () => {
    osc.disconnect();
    amp.disconnect();
  };
}

startBtn.addEventListener("click", startAudio);
playBtn.addEventListener("click", playNote);

freq.addEventListener("input", () => {
  setTextOutputs();
});

vol.addEventListener("input", () => {
  setTextOutputs();
  if (masterGain && ctx) masterGain.gain.setValueAtTime(Number(vol.value), ctx.currentTime);
});

cutoff.addEventListener("input", () => {
  setTextOutputs();
  if (filter && ctx) filter.frequency.setValueAtTime(Number(cutoff.value), ctx.currentTime);
});
