// Access to features of web audio API -> Graph of Audio Nodes
var ctx = new(window.AudioContext || window.webkitAudioContext)();
console.log(ctx);

var analyser = ctx.createAnalyser();
console.log(analyser);

var filter = ctx.createBiquadFilter();
console.log(filter);
filter.type = "highpass";

var osc = ctx.createOscillator();
console.log(osc); // Source Node

var gain = ctx.createGain();
console.log(gain);

// Modular routing nodes can be connected to other nodes

// Destination

// osc.connect(ctx.destination);

// osc.start();

// setTimeout(() => {
//     osc.stop();
// }, 2000)
