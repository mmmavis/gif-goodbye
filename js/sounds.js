var url = window.location;
var path = url.pathname;
var path = "./";


var sounds = {
  "move" : {
      url : path + "sounds/move.mp3",
      volume: .2
  },
  "knock" : {
    url : path + "sounds/knock.mp3",
    volume: .5
  },
  "join" : {
    url : path + "sounds/chime.mp3",
    volume: .4
  },
  "leave" : {
    url : path + "sounds/leave.wav",
  }
};

var soundContext = new AudioContext();

for(var key in sounds) {
  loadSound(key);
}

function loadSound(name){
  var sound = sounds[name];

  var url = sound.url;
  var buffer = sound.buffer;

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    soundContext.decodeAudioData(request.response, function(newBuffer) {
      sound.buffer = newBuffer;
    });
  }

  request.onerror = function() {
    console.log("nope");
  }

  request.send();
}

function getRandom(min, max){
  return min + Math.random() * (max-min);
}

function playSound(name, options){
  var sound = sounds[name];
  var soundVolume = sounds[name].volume || 1;

  var buffer = sound.buffer;
  if(buffer){
    var source = soundContext.createBufferSource();
    source.buffer = buffer;

    var volume = soundContext.createGain();

    if(options) {
      if(options.volume) {
        volume.gain.value = soundVolume * options.volume;
      }
    } else {
      volume.gain.value = soundVolume;
    }

    volume.connect(soundContext.destination);
    source.connect(volume);
    source.start(0);
  }
}
