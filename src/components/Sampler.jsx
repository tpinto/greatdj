var React = require('react');

var soundFiles = {
  horn: '/static/audio/horn.mp3',
  stab: '/static/audio/orch5.wav',
  rimshot: '/static/audio/rimshot.mp3',
  cowbell: '/static/audio/cowbell.mp3',
  gun: '/static/audio/gun.mp3',
  reload: '/static/audio/reload.wav',
  machinegun: '/static/audio/machinegun.mp3'
}

var sounds = {};

var Sampler = React.createClass({

  componentWillMount: function(){
    window.addEventListener('keydown', this.handleKeyDown);
  },

  handleKeyDown: function(e){
    if(e.target !== document.body) return;
    switch(e.which){
      case 72: // h
        this.playSound('horn', 0.2);
        break;
      case 79: // o
        this.playSound('stab', 0.1);
        break;
      case 82: // r
        this.playSound('rimshot');
        break;
      case 67: // c
        this.playSound('cowbell');
        break;
      case 71: // g
        this.playSound('gun');
        break;
      case 77: // m
        this.playSound('machinegun');
        break;
      case 69: // e
        this.playSound('reload');
        break;
    }
  },

  playSound: function(soundId, start){
    start = start || 0;
    if(sounds[soundId]){
      sounds[soundId].currentTime = start;
      sounds[soundId].play();
    } else {
      sounds[soundId] = new Audio(soundFiles[soundId]);
      sounds[soundId].play();
    }
  },

  render: function() {
    return (
      <div />
    );
  }

});

module.exports = Sampler;