var ctx = new (window.AudioContext || window.webkitAudioContext)();

var osc = ctx.createOscillator();

// osc.type = "sine";
// osc.type = "square";
// osc.type = "triangle";
// osc.type = "sawtooth";

// voltage shape of various waveform (rise and fall of voltage -> time and amplitude).

// Different harmonic content generated

// Sine only fundamental
// Square most overtones (blended with fundamental at different amplitudes)

osc.connect(ctx.destination);

osc.start();

setTimeout(() => {
    osc.stop();
}, 2000);
