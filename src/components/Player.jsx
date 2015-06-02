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
        //videoId: that.props.videoId,
        events: {
          'onReady': that.props.playerReady,
          'onStateChange': that._handlePlayerStateChange
        }
      });

      that.setState({player: player});
    });

    var scIframe = this.refs.scPlayerFrame.getDOMNode();
    scIframe.src = 'https://w.soundcloud.com/player/?url=';
    var scPlayer = SC.Widget(scIframe);
    scPlayer.bind(SC.Widget.Events.FINISH, this.props.ended);
    this.setState({scPlayer: scPlayer});

    window.addEventListener('restartVideo', function(e){
      that._restartCurrentVideo();
    });

    this._activatePlayer('youtube');
  },

  componentWillUpdate: function(nextProps, nextState) {
    console.log(nextProps, this.props)
    if (nextProps.video && (!this.props.video || this.props.video.id !== nextProps.video.id)) {
      this._loadNewVideo(nextProps.video);
    } else if (this.props.position !== nextProps.position && this.state.player.getPlayerState && !this.state.player.getPlayerState()){
      this._loadNewVideo(nextProps.video);
    }
  },

  _loadNewVideo: function(video) {
    this._activatePlayer(video.source);

    switch(video.source){
      case 'youtube':
        this._loadNewYTVideo(video);
        break;
      case 'soundcloud':
        this._loadNewSCTrack(video);
        break;
    }
  },

  _loadNewYTVideo: function(video){
    var startAt = this.props.dts && this.props.dts > 2000 ?
      this.props.dts/1000 : 0;

    log(startAt, this.props.ts);
    startAt = 0;

    if(this.state.player.loadVideoById){
      this.props.autoplay ?
        this.state.player.loadVideoById(video.id, startAt, "hd720") :
        this.state.player.cueVideoById(video.id);

      this.state.player.setPlaybackQuality("hd720");
      this.refs.curtain.getDOMNode().style.display = 'none';
    } else {
      console.warn('* Player: Can\'t play yet!');
    }
  },

  _loadNewSCTrack: function(video){
    this.state.scPlayer.load(video.url, {auto_play: true});
  },

  _restartCurrentVideo: function(){
    this.state.player.seekTo(0); //@todo
  },

  _activatePlayer: function(source){
    switch(source){
      case 'youtube':
        this.refs.ytPlayer.getDOMNode().style.display = 'block';
        this.refs.scPlayer.getDOMNode().style.display = 'none';
        this.state.scPlayer && this.state.scPlayer.pause();
        break;

      case 'soundcloud':
        this.refs.scPlayer.getDOMNode().style.display = 'block';
        this.refs.ytPlayer.getDOMNode().style.display = 'none';
        this.state.player && this.state.player.pauseVideo();
        break;
    }

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
      <div className="players">
        <div className="youtube-player-container" ref="ytPlayer">
          <div className="curtain" ref="curtain"></div>
          <div id="youtube-player"></div>
        </div>
        <div className="soundcloud-player" ref="scPlayer">
          <iframe ref="scPlayerFrame" border="0"></iframe>
        </div>
      </div>
    );
  }

});

module.exports = Player;
