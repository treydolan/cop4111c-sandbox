introJs.tour().setOptions({
  steps: [{
    intro: "Hello world!"
  }, {
    element: document.querySelector('#login'),
    intro: "Click here to login!"
  }, {
    element: document.querySelector('#calendar'),
    intro: "Schedule an appointment"
  }
]
}).start()

$( function() {
    $( "#datepicker" ).datepicker();
    $( "#timepicker" ).timepicker();
} );