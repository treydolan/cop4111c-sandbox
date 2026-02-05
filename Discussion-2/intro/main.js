// introJs.tour().setOptions({
//   steps: [{
//     intro: "Welcome to the Discussion 2!"
//   }, {
//     element: document.querySelector('#login'),
//     intro: "Click here to login!"
//   }, {
//     element: document.querySelector('#calendar'),
//     intro: "Schedule an appointment"
//   }
// ]
// }).start()

introJs.tour().setOptions({
  showProgress: true,
  exitOnOverlayClick: false,
  nextLabel: 'Next →',
  prevLabel: '← Back',
  doneLabel: 'Finish Tour'
}).start();
