const ctx = new (window.AudioContext ? window.AudioContext : window.webkitAudioContext)();

const osc = ctx.createOscillator();

osc.connect(ctx.destination);

// osc.frequency.value = 440;

osc.start(0);
// osc.stop(1);

const frequencyRange = document.querySelector("input");

frequencyRange.addEventListener("input", (event) => {
    console.log(event.target.value);
    osc.frequency.value = event.target.value;
})
