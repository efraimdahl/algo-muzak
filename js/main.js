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


nodes = [];
gainz = [];


function adsr (param, peak, val, time, a, d, s) {
  /*
                peak
                /\   val  val
               /| \__|____|
              / |    |    |\
             /  |    |    | \
       init /a  |d   |s   |r \ init

       <----------time------------>
       thANk YoU N!CK!!!
  */
  const initVal = param.value
  param.setValueAtTime(0, time)
  param.linearRampToValueAtTime(peak, time+a)
  param.linearRampToValueAtTime(val, time+a+d)
  param.linearRampToValueAtTime(val, time+a+d+s)
}

const p = 0.3 // peak value for all tones
const v = 0.1 

keyboard.keyDown = function (note, frequency) {
    var oscillator = ctx.createOscillator();
    var oscGain = ctx.createGain();
    oscGain.gain.value = 0.2;
    adsr(oscGain.gain, p,v, ctx.currentTime, 1,0.1,0.4)
    oscGain.connect(ctx.destination); 
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.start(0);
    oscillator.connect(oscGain);
    oscillator.connect(fft);
    gainz.push(oscGain);
    nodes.push(oscillator);

};

function stopNotes(i){
  //nodes[i].stop(ctx.currentTime+1);
  gainz[i].disconnect();
  nodes[i].disconnect();
}
keyboard.keyUp = function (note, frequency) {
   for (var i = 0; i < nodes.length; i++) {
         if (Math.round(nodes[i].frequency.value) == Math.round(frequency)) {
             gainz[i].gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
             setTimeout(stopNotes(i),1000);  
         }
        }
    // var new_nodes = [];
    // var new_gainz = [];

    // for (var i = 0; i < nodes.length; i++) {
    //     if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
    //         //nodes[i].stop(ctx.currentTime + 3);
    //         //nodes[i].disconnect();

    //         gainz[i].disconnect();
    //     } else {
    //         new_nodes.push(nodes[i]);
    //         new_gainz.push(nodes[i]);
            
    //     }
    // }

    // nodes = new_nodes;
    // gainz = new_gainz;
};
