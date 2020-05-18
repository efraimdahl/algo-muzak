const ctx = new (window.AudioContext || window.webkitAudioContext)()
const fft = new AnalyserNode(ctx, { fftSize: 2048 })
createWaveCanvas({ element: 'section', analyser: fft })

var keyboard = new QwertyHancock({
  id: 'keyboard',
  width: innerWidth/2,
  height: innerHeight/3,
  octaves: 2,
  startNote: 'A3',
  whiteNotesColour: '#9e0035',
  blackNotesColour: '#9e0035',
  activeColour: '#9e0035',
  borderColour: '#9e0035'
})

nodes = [];

masterGain = ctx.createGain();
nodes = [];

masterGain.gain.value = 0.3;
masterGain.connect(ctx.destination); 

keyboard.keyDown = function (note, frequency) {
    var oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.start(0);
    oscillator.connect(masterGain);
    oscillator.connect(fft);
    nodes.push(oscillator);
};


keyboard.keyUp = function (note, frequency) {
    var new_nodes = [];

    for (var i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0);
            nodes[i].disconnect();
        } else {
            new_nodes.push(nodes[i]);
        }
    }

    nodes = new_nodes;
};
