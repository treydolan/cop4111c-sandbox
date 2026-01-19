function speakText() {
    var text = document.getElementById("textInput").value;
    if (text != "") {
      var speech = new SpeechSynthesisUtterance();
      speech.text = text;
      window.speechSynthesis.speak(speech);
  
    } else {
      alert("Please type something first!");
    }
  }