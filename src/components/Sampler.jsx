var React = require('react');

var hornMp3 = '/static/audio/horn.mp3',
    stabMp3 = '/static/audio/orch5.wav',
    rimshotMp3 = '/static/audio/rimshot.mp3',
    cowbellMp3 = '/static/audio/cowbell.mp3';

var sounds = {};

var Sampler = React.createClass({

  componentWillMount: function(){
    window.addEventListener('keydown', this.handleKeyDown);
  },

  handleKeyDown: function(e){
    if(e.target !== document.body) return;
    switch(e.which){
      case 72: // h
        this.playSound(hornMp3, 'horn', 0.2);
        break;
      case 79: // o
        this.playSound(stabMp3, 'stab');
        break;
      case 82: // r
        this.playSound(rimshotMp3, 'rimshot');
        break;
      case 67: // c
        this.playSound(cowbellMp3, 'cowbell');
        break;
    }
  },

  playSound: function(mp3, soundId, start){
    start = start || 0;
    if(sounds[soundId]){
      sounds[soundId].currentTime = start;
      sounds[soundId].play();
    } else {
      sounds[soundId] = new Audio(mp3);
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