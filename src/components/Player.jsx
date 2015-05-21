/**
 * @jsx React.DOM
 */

var React = require('react');
var sdk = require('require-sdk')('https://www.youtube.com/iframe_api', 'YT');
var loadTrigger = sdk.trigger();
var log = require('bows')('Player');

// YT API requires global ready event handler
window.onYouTubeIframeAPIReady = function () {
  loadTrigger();
  delete window.onYouTubeIframeAPIReady;
};


var Player = React.createClass({
  getInitialState: function(){
    return {player: {}};
  },

  componentDidMount: function() {
    var that = this;
    // called once API has loaded.
    sdk(function(err, youtube) {
      var player = new youtube.Player("youtube-player", {
        videoId: that.props.videoId,
        events: {
          'onReady': that.props.playerReady,
          'onStateChange': that._handlePlayerStateChange
        }
      });

      that.setState({player: player});
    });

    window.addEventListener('restartVideo', function(e){
      that._restartCurrentVideo();
    });
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (this.props.videoId !== nextProps.videoId) {
      this._loadNewUrl(nextProps.videoId);
    } else if (this.props.position !== nextProps.position && this.state.player.getPlayerState && !this.state.player.getPlayerState()){
      this._loadNewUrl(nextProps.videoId);
    }
  },

  _loadNewUrl: function(videoId) {
    var startAt = this.props.dts && this.props.dts > 2000 ?
      this.props.dts/1000 : 0;

    if(this.state.player.loadVideoById){
      this.props.autoplay ?
        this.state.player.loadVideoById(videoId, startAt, "hd720") :
        this.state.player.cueVideoById(videoId);

      this.state.player.setPlaybackQuality("hd720");
      this.refs.curtain.getDOMNode().style.display = 'none';
    } else {
      console.warn('* Player: Can\'t play yet!');
    }
  },

  _restartCurrentVideo: function(){
    this.state.player.seekTo(0);
  },

  _handlePlayerStateChange: function(event) {
    switch(event.data) {
      case 0:
        this.props.ended();
        break;

      case 1:
        this.props.playing();
        break;

      case 2:
        this.props.stopped();
        break;

      default:
        return;
    }
  },

  render: function() {
    return (
      <div className="youtube-player-container">
        <div className="curtain" ref="curtain"></div>
        <div id="youtube-player"></div>
      </div>
    );
  }

});

module.exports = Player;
