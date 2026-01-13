# Web Audio API Mini Synth

This project is a simple demonstration of the **Web Audio API** created for Discussion 1. The example uses **only vanilla HTML, CSS, and JavaScript** and does not rely on any external libraries or frameworks. It demonstrates how core Web Audio components can be connected together to produce and control sound in the browser.

---

## Project Overview

The Mini Synth allows a user to:
- Start an audio context using a required user interaction
- Play a short synthesized tone
- Select different waveform types
- Adjust frequency (pitch)
- Control volume
- Modify a low-pass filter cutoff frequency

This project illustrates how an audio routing graph is built and controlled using the Web Audio API.

---

## Files Included

- `index.html` – Page structure and audio controls  
- `styles.css` – Layout and visual styling  
- `script.js` – Web Audio API logic and interactivity  

---

## How It Works

Modern browsers block audio playback until a user performs an action. Clicking **Start Audio** initializes and resumes the `AudioContext`. Once active, the **Play Note** button creates a new oscillator, applies the selected settings, and plays a short tone.

The audio signal follows this path:


- **OscillatorNode** generates the sound wave  
- **BiquadFilterNode** applies a low-pass filter to shape the sound  
- **GainNode** controls the overall output volume  

A short volume envelope is applied to prevent clicking sounds when notes start and stop.

---

## Web Audio API Concepts Demonstrated

- **AudioContext** – Core audio processing engine  
- **OscillatorNode** – Sound generation  
- **GainNode** – Volume control and envelopes  
- **BiquadFilterNode** – Frequency filtering  
- **Audio Routing Graph** – Connected audio nodes forming a signal chain  

---

## Challenges Encountered

- Browsers require a user gesture before audio can play, making a Start Audio button necessary.
- The `AudioContext` may begin in a suspended state and must be resumed manually.
- Sudden volume changes can cause audible clicks, which were resolved using a short gain envelope.

---

## Usefulness of the Web Audio API

The Web Audio API is useful for:
- Interactive web applications
- Games and sound effects
- Music and synthesis tools
- Educational audio demonstrations
- Enhanced user interface feedback

---

## Ease of Use

While the Web Audio API has a learning curve, it becomes intuitive once the concept of connecting audio nodes together is understood. With proper handling of browser restrictions and timing, it provides powerful and precise control over sound in the browser.

---

## Validation and Requirements

- All HTML and CSS code validates with the W3C validators with no errors or warnings.
- No libraries or frameworks were used.
- The `develop` and `main` branches are in sync.
- The example runs directly from the main branch ZIP download.

---

## Summary

This project provides a clean, practical example of the Web Audio API in action and demonstrates how modern browsers can generate and manipulate audio using standard HTML5 technologies.
