/**
 * @jsx React.DOM
 */

var React = require('react'),
    Player = require('./Player'),
    Playlist = require('./Playlist'),
    PLAY_MODES = require('../constants/AppConstants').playModes;

var PlayerComponent = React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      playlistToggled: true,
    };
  },

  componentDidMount: function(){
    var that = this;

    this.played = [];

    window.addEventListener('enqueue', function(e){
      var playlist = that.props.playlist;
      playlist.push(e.detail.video);

      var pos = that.props.position;
      if(pos < playlist.length && !that.state.playing){
        that.props.setPlaylistChange({playlist: playlist, position: pos + 1});
      } else {
        that.props.setPlaylistChange({playlist: playlist});
      }

    }, false);

    window.addEventListener('playNow', function(e){
      var playlist = that.props.playlist,
          currPos = that.props.position;

      playlist.splice(currPos + 1, 0, e.detail.video);

      that.props.setPlaylistChange({
        playlist: playlist,
        position: currPos + 1
      });

      that.playVideoByPos(currPos + 1);
    }, false);
  },

  componentDidUpdate: function(oldProps){
    if(this.props.position !== oldProps.position){
      this.playVideoByPos(this.props.position);
    }
  },

  // --- handlers

  handlePlaylistAdd: function(newPlaylist){
    var pos = this.props.position;
    if(pos < newPlaylist.length && !this.state.playing){
      this.props.setPlaylistChange({position: pos + 1});
    }
  },

  handleVideoPlaying: function(){
    var pos = this.props.position,
        pl = this.props.playlist;

    document.title =  pl[pos].snippet.title + ' \u266B ' + window.app.baseTitle;
  },

  handleVideoEnded: function(){
    var pos = this.getNextSong(),
        pl = this.props.playlist;

    if(pos > -1){
      // next video go!
      if(pos != this.props.position){
        this.setState({video: pl[pos].id});
        this.props.setPlaylistChange({position: pos});
        this.played.push(pl[pos].id);
      } else {
        // shitty edge case of restarting a video
        window.dispatchEvent(new CustomEvent('restartVideo'));
      }
    } else {
      // no video, stop
      this.setState({playing: false});
      document.title = window.app.baseTitle;
    }
  },

  handlePlayNow: function(pos, video){
    if(pos !== this.props.position){
      this.props.setPlaylistChange({position: pos});
    } else {
      // clicked on the currently playing video
      window.dispatchEvent(new CustomEvent('restartVideo'));
    }
  },

  handleDeleteEntry: function(pos, video){
    var pl = this.props.playlist,
        currPos = this.props.position;

    // if deleting from history, decrease the position of the playing video on the playlist
    if(pos < currPos){
      currPos -= 1;
    }

    // remove the element from the playlist
    pl.splice(pos, 1);

    if(this.played.indexOf(video.id) > -1){
      var playedIndex = this.played.indexOf(video.id);
      this.played.splice(playedIndex, 1);
    }

    this.props.setPlaylistChange({
      playlist: pl,
      position: currPos
    });
  },

  handleRepeatClick: function(){
    if(this.props.repeatMode === PLAY_MODES.repeat.all){
      this.props.setRepeatMode(PLAY_MODES.repeat.off);
    } else {
      this.props.setRepeatMode(PLAY_MODES.repeat.all);
    }
  },

  handleShuffleClick: function(){
    var newShuffle = !this.props.shuffleActive;
    this.props.setShuffleActive(newShuffle);
  },

  // ----

  getNextSong: function(){
    if(this.props.shuffleActive){
      if(this.played.length === this.props.playlist.length){
        // already played all videos on current playlist
        if(this.props.repeatMode === PLAY_MODES.repeat.all){
          // restart
          this.played = [];
        } else {
          // stop
          return -1;
        }
      }

      var pos, videoId;
      do {
        pos = Math.floor(Math.random() * this.props.playlist.length);
        videoId = this.props.playlist[pos].id;
      } while(this.played.indexOf(videoId) > -1);

      console.log('gonna return', pos, this.played);

      return pos;

    } else {
      var nextPos = this.props.position + 1;
      if(nextPos < this.props.playlist.length){
        // go to next video
        return nextPos;

      } else if(this.props.repeatMode === PLAY_MODES.repeat.all){
        // go to first video
        return 0;

      } else {
        // stop
        return -1;

      }
    }

    if (this.props.repeatAll) {
      if (pl.length==1) { // One video in playlist
        window.dispatchEvent(new CustomEvent('restartVideo'));
      } else {
        this.setState({videoId: pl[0]});
        this.props.setPlaylistChange({position: 0});
      }
    }

  },

  toggleFullPlaylist: function(){
    if(this.refs.playlistToggle.getDOMNode().classList.contains('disabled')) return;
    var p = !this.state.playlistToggled;
    this.setState({playlistToggled: p});
  },

  playVideoByPos: function(pos){
    if(pos >= 0){
      this.setState({
        video: this.props.playlist[pos],
        playing: true
      });
    }
  },

  // ------
  // ------ f
  // xxxxxx
  // ------
  // ------ t
  //        (f)
  // ------
  switchPlaylistItems: function(fromIndex, toIndex){
    var pl = this.props.playlist,
        moving = this.props.playlist[fromIndex],
        newPos = this.props.position,
        fromIndex = +fromIndex,
        toIndex = +toIndex;

    if(fromIndex === toIndex) return;

    var newToIndex = (toIndex < fromIndex) ? +toIndex + 1 : toIndex;

    var from = pl.splice(fromIndex, 1)[0];
    pl.splice(newToIndex, 0, from);

    if (this.props.position === fromIndex){
      newPos = newToIndex;
    } else if(fromIndex < this.props.position && this.props.position <= toIndex){
      newPos--;
    } else if(fromIndex > this.props.position && this.props.position > toIndex){
      newPos++;
    }

    this.props.setPlaylistChange({
      playlist: pl,
      position: newPos
    });

  },

  noop: function(){},

  render: function() {
    var btnToggleClassName = 'playlist-toggle flat ' + (!this.props.position ? 'disabled' : '');
    var icoClassName = this.state.playlistToggled ? 'fa fa-chevron-down' : 'fa fa-chevron-up';
    return (
      <div>
        <Player
          autoplay="true"
          video={this.state.video}
          position={this.props.position}
          ts={this.props.ts}
          dts={this.props.dts}
          playing={this.handleVideoPlaying}
          stopped={this.noop}
          ended={this.handleVideoEnded}
          switchPlaylistItems={this.props.switchPlaylistItems}
          playerReady={this.props.onPlayerReady} />

        <div className={"playlist-toolbar" + (!this.props.playlist.length ? " _hide" : "")}>
          <div className="btn-group">
            <button className={this.props.shuffleActive ? 'active' : ''} onClick={this.handleShuffleClick}>
              <i className="fa fa-random"></i>
            </button>

            <button className={this.props.repeatMode === PLAY_MODES.repeat.all ? 'active' : ''} onClick={this.handleRepeatClick}>
              <i className="fa fa-repeat"></i>
            </button>
          </div>

          <button className={btnToggleClassName} ref="playlistToggle" onClick={this.toggleFullPlaylist} ><i className={icoClassName}></i></button>
        </div>

        <Playlist
          playlist={this.props.playlist}
          position={this.props.position}
          playlistToggled={this.state.playlistToggled}
          switchPlaylistItems={this.switchPlaylistItems}
          handleDeleteEntry={this.handleDeleteEntry}
          handlePlayNow={this.handlePlayNow} />
      </div>
    );
  }

});


module.exports = PlayerComponent;
