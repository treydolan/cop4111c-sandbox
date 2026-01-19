//Variables
let context = null;
let waveforms = ["sine", "square", "sawtooth", "triangle"];
let pitchSlider = document.getElementById('pitchSlider');
let volumeSlider = document.getElementById('volumeSlider');
let reverbSlider = document.getElementById('reverbSlider');
let dropDown = document.getElementById('sounds');

function playSound(pitch)
{
    if(context == null)
    {  
        //Creates the instance that uses the Web Audio API
        context = new AudioContext();
    }
    
    //Creates nodes to control to generate and control a sound
    let oscillatorNode = context.createOscillator();
    let gainNode = context.createGain();
    let sound1 = pitch + (pitchSlider.value / 10);
    
    //The sound that produces
    oscillatorNode.type = dropDown.value;

    //Determines the pitch/frequency
    let frequency = sound1;
    oscillatorNode.frequency.value = frequency;

    // Dividing the sliders value fixes the sound from infinalty playing. 
    // (I have no clue how this fixes it let alone why the issue came up in the first place)
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + (reverbSlider.value / 1));

    // Determines the volume
    gainNode.gain.value = volumeSlider.value;

    //Connects the sounds to the speckers (Required)
    oscillatorNode.connect(gainNode);
    gainNode.connect(context.destination);

    // Plays the sound
    oscillatorNode.start(0);
   
   
}