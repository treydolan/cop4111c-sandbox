/**
 * SpeakEasy - Web Speech API Demo
 * Author: Bensky Sainvilus
 * Course: CTS2356 Web Development
 */

// Immediately Invoked Function Expression (IIFE) to avoid polluting global scope
(function() {
    // Enable strict mode for better error catching and cleaner code
    'use strict';

    // Check if the browser supports the Web Speech API
    if (!('speechSynthesis' in window)) {
        // Alert the user if their browser doesn't support the API
        alert('Your browser does not support the Web Speech API. Please try Chrome, Edge, Safari, or Firefox.');
        // Exit the function early since we can't continue without support
        return;
    }

    // Get the textarea element where users type text to be spoken
    var textInput = document.getElementById('text-input');
    // Get the dropdown select element for choosing voices
    var voiceSelect = document.getElementById('voice-select');
    // Get the range slider for controlling speech speed
    var rateRange = document.getElementById('rate-range');
    // Get the span element that displays the current rate value
    var rateValue = document.getElementById('rate-value');
    // Get the range slider for controlling speech pitch
    var pitchRange = document.getElementById('pitch-range');
    // Get the span element that displays the current pitch value
    var pitchValue = document.getElementById('pitch-value');
    // Get the range slider for controlling speech volume
    var volumeRange = document.getElementById('volume-range');
    // Get the span element that displays the current volume percentage
    var volumeValue = document.getElementById('volume-value');
    // Get the Speak button element
    var speakBtn = document.getElementById('speak-btn');
    // Get the Pause button element
    var pauseBtn = document.getElementById('pause-btn');
    // Get the Resume button element
    var resumeBtn = document.getElementById('resume-btn');
    // Get the Stop button element
    var stopBtn = document.getElementById('stop-btn');
    // Get the status dot indicator element
    var statusIndicator = document.getElementById('status-indicator');
    // Get the status text element that shows current state
    var statusText = document.getElementById('status-text');

    // Store reference to the speechSynthesis API object
    var synth = window.speechSynthesis;
    // Initialize empty array to store available voices
    var voices = [];
    // Variable to hold the current speech utterance object
    var currentUtterance = null;

    /**
     * Load available voices into the select dropdown
     */
    function loadVoices() {
        // Get all available voices from the speech synthesis API
        voices = synth.getVoices();
        // Clear any existing options in the voice dropdown
        voiceSelect.innerHTML = '';

        // Check if no voices are available
        if (voices.length === 0) {
            // Create a new option element
            var option = document.createElement('option');
            // Set the option value to empty string
            option.value = '';
            // Set the display text for the option
            option.textContent = 'No voices available';
            // Add the option to the dropdown
            voiceSelect.appendChild(option);
            // Exit the function since there are no voices to add
            return;
        }

        // Loop through each available voice
        voices.forEach(function(voice, index) {
            // Create a new option element for this voice
            var option = document.createElement('option');
            // Set the option value to the voice index number
            option.value = index;
            // Set the display text to show voice name and language
            option.textContent = voice.name + ' (' + voice.lang + ')';
            // Check if this is the system default voice
            if (voice.default) {
                // Mark this option as selected by default
                option.selected = true;
            }
            // Add the option to the voice dropdown
            voiceSelect.appendChild(option);
        });
    }

    /**
     * Update the status indicator and text
     * @param {string} status - The current status: 'ready', 'speaking', or 'paused'
     * @param {string} message - The message to display to the user
     */
    function setStatus(status, message) {
        // Reset the status indicator to only have the base class
        statusIndicator.className = 'status-dot';
        // Check if the status is speaking
        if (status === 'speaking') {
            // Add the speaking class for green animated indicator
            statusIndicator.classList.add('speaking');
        // Check if the status is paused
        } else if (status === 'paused') {
            // Add the paused class for orange indicator
            statusIndicator.classList.add('paused');
        }
        // Update the status text to show the message
        statusText.textContent = message;
    }

    /**
     * Enable or disable buttons based on current speech state
     * @param {boolean} speaking - Whether speech is currently active
     * @param {boolean} paused - Whether speech is currently paused
     */
    function setButtonStates(speaking, paused) {
        // Disable speak button when speaking and not paused
        speakBtn.disabled = speaking && !paused;
        // Disable pause button when not speaking or already paused
        pauseBtn.disabled = !speaking || paused;
        // Disable resume button when not paused
        resumeBtn.disabled = !paused;
        // Disable stop button when not speaking
        stopBtn.disabled = !speaking;
    }

    /**
     * Convert the entered text to speech
     */
    function speak() {
        // Get the text from the textarea and remove whitespace from ends
        var text = textInput.value.trim();

        // Check if the text is empty
        if (text === '') {
            // Update status to prompt user to enter text
            setStatus('ready', 'Enter some text first');
            // Exit the function since there's nothing to speak
            return;
        }

        // Check if there is currently speech playing
        if (synth.speaking) {
            // Cancel any ongoing speech before starting new speech
            synth.cancel();
        }

        // Create a new SpeechSynthesisUtterance object with the text
        currentUtterance = new SpeechSynthesisUtterance(text);

        // Get the selected voice index from the dropdown
        var voiceIndex = voiceSelect.value;
        // Check if a valid voice is selected
        if (voiceIndex !== '' && voices[voiceIndex]) {
            // Assign the selected voice to the utterance
            currentUtterance.voice = voices[voiceIndex];
        }

        // Set the speech rate from the slider (0.5 to 2)
        currentUtterance.rate = parseFloat(rateRange.value);
        // Set the speech pitch from the slider (0 to 2)
        currentUtterance.pitch = parseFloat(pitchRange.value);
        // Set the speech volume from the slider (0 to 1)
        currentUtterance.volume = parseFloat(volumeRange.value);

        // Event handler that fires when speech starts
        currentUtterance.onstart = function() {
            // Update status to show speaking state
            setStatus('speaking', 'Speaking...');
            // Update buttons: speaking=true, paused=false
            setButtonStates(true, false);
        };

        // Event handler that fires when speech finishes
        currentUtterance.onend = function() {
            // Update status to show completion
            setStatus('ready', 'Done');
            // Update buttons: speaking=false, paused=false
            setButtonStates(false, false);
            // Clear the current utterance reference
            currentUtterance = null;
        };

        // Event handler that fires if an error occurs
        currentUtterance.onerror = function(e) {
            // Update status to show the error message
            setStatus('ready', 'Error: ' + e.error);
            // Update buttons to reset state
            setButtonStates(false, false);
            // Clear the current utterance reference
            currentUtterance = null;
        };

        // Event handler that fires when speech is paused
        currentUtterance.onpause = function() {
            // Update status to show paused state
            setStatus('paused', 'Paused');
            // Update buttons: speaking=true, paused=true
            setButtonStates(true, true);
        };

        // Event handler that fires when speech resumes
        currentUtterance.onresume = function() {
            // Update status to show speaking state
            setStatus('speaking', 'Speaking...');
            // Update buttons: speaking=true, paused=false
            setButtonStates(true, false);
        };

        // Start speaking the utterance using the speech synthesis API
        synth.speak(currentUtterance);
    }

    /**
     * Pause the current speech playback
     */
    function pause() {
        // Check if currently speaking and not already paused
        if (synth.speaking && !synth.paused) {
            // Pause the speech synthesis
            synth.pause();
        }
    }

    /**
     * Resume paused speech playback
     */
    function resume() {
        // Check if speech is currently paused
        if (synth.paused) {
            // Resume the speech synthesis
            synth.resume();
        }
    }

    /**
     * Stop and cancel current speech playback
     */
    function stop() {
        // Check if currently speaking
        if (synth.speaking) {
            // Cancel and stop all speech
            synth.cancel();
            // Update status to show stopped state
            setStatus('ready', 'Stopped');
            // Reset all button states
            setButtonStates(false, false);
        }
    }

    /**
     * Initialize the application when DOM is ready
     */
    function init() {
        // Load available voices into the dropdown
        loadVoices();
        // Check if the onvoiceschanged event is supported
        if (speechSynthesis.onvoiceschanged !== undefined) {
            // Set up listener to reload voices when they change (needed for Chrome)
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Add click event listener to the Speak button
        speakBtn.addEventListener('click', speak);
        // Add click event listener to the Pause button
        pauseBtn.addEventListener('click', pause);
        // Add click event listener to the Resume button
        resumeBtn.addEventListener('click', resume);
        // Add click event listener to the Stop button
        stopBtn.addEventListener('click', stop);

        // Add input event listener to the rate slider
        rateRange.addEventListener('input', function() {
            // Update the displayed rate value when slider moves
            rateValue.textContent = this.value;
        });

        // Add input event listener to the pitch slider
        pitchRange.addEventListener('input', function() {
            // Update the displayed pitch value when slider moves
            pitchValue.textContent = this.value;
        });

        // Add input event listener to the volume slider
        volumeRange.addEventListener('input', function() {
            // Convert 0-1 value to percentage and update display
            volumeValue.textContent = Math.round(this.value * 100);
        });

        // Set the initial status to ready
        setStatus('ready', 'Ready');
        // Set initial button states with no active speech
        setButtonStates(false, false);

        // Add event listener for when user leaves the page
        window.addEventListener('beforeunload', function() {
            // Check if speech is currently playing
            if (synth.speaking) {
                // Cancel speech to prevent it from continuing after page close
                synth.cancel();
            }
        });
    }

    // Check if the DOM is still loading
    if (document.readyState === 'loading') {
        // Wait for DOM to be ready before initializing
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready, initialize immediately
        init();
    }
// End of IIFE - the parentheses invoke the function immediately
})();