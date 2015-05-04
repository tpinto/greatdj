 /**
  * @jsx React.DOM
  */

var React = require('react'),
    urllite = require('urllite'),
    isMobile = require('ismobilejs'),
    log = require('bows')('StateHandler');

var SearchComponent = require('./SearchComponent'),
    PlayerComponent = require('./PlayerComponent'),
    FeedbackComponent = require('./FeedbackComponent'), // @todo ?
    Sampler = require('react-sampler');

var PlaylistStore = require('../stores/PlaylistStore'),
    SearchStore = require('../stores/SearchStore');

var PlaylistActions = require('../actions/PlaylistActions'),
    SearchActions = require('../actions/SearchActions');

var PLAY_MODES = require('../constants/AppConstants').playModes;

var samples = [{
  file: '/static/audio/horn.mp3',
  key: 'h', // horn
  startAt: 0.2 //seconds, obvs
},{
  file: '/static/audio/orch5.wav',
  key: 'o', // orchestra hit
  startAt: 0.05
},{
  file: '/static/audio/rimshot.mp3',
  key: 's' // rimshot
},{
  file: '/static/audio/cowbell.mp3',
  key: 'c' // cowbell
},{
  file: '/static/audio/gun.mp3',
  key: 'g' // gun shot
},{
  file: '/static/audio/reload.wav',
  key: 'r' // reload!
},{
  file: '/static/audio/machinegun.mp3',
  key: 'm' // machine gun
}];

var StateHandler = React.createClass({
  getInitialState: function(){
    return {
      playlist: PlaylistStore.getPlaylist(),
      results: SearchStore.getVideos(),
      recentTerms: SearchStore.getRecentTerms(),
      position: PlaylistStore.getPosition(),
      playlistId: PlaylistStore.getPlaylistId(),
      sync: PlaylistStore.getSync(),
      currentQuery: SearchStore.getCurrentQuery(),
      showFeedbackForm: false,
      hdOnly: false,
      repeatMode: PLAY_MODES.repeat.off,
      shuffleActive: false,
      popularPlaylists: PlaylistStore.getPopularPlaylists()
    };
  },

  componentWillMount: function(){
    var that = this;

    PlaylistStore.addChangeListener(this._onChange);
    SearchStore.addChangeListener(this._onChange);

    // using hashchanges for the query searches
    window.onhashchange = function(){
      var q = location.hash.slice(1);
      if(q){
        SearchActions.search(q, that.state.hdOnly ? 'high' : 'any');
      } else {
        SearchActions.resetResults();
      }
    };
  },

  componentDidMount: function(){
    if(location.hash){
      window.dispatchEvent(new CustomEvent('hashchange'));
    }

    var url = urllite(document.location.href),
        that = this,
        id;

    // if you're accessing via a mobile device and there are parties for your IP
    // you'll be automatically added to the parteh
    if(window.DATA.playlists && window.DATA.playlists.length){
      if(isMobile.any){
        id = window.DATA.playlists[0];
        PlaylistActions.setPlaylistId(id);
        PlaylistActions.sync(id);

      } else {
        log('playlist in this network detected:', window.DATA.playlists[0]);
      }

    }

    if(url.pathname.length > 1 && !(id && isMobile.any)){
      // direct link to a playlist
      // do a server request with url.hash
      id = url.pathname.slice(1);
      PlaylistActions.load(id);
    }

    PlaylistActions.getPopularPlaylists();

  },

  setShuffleActive: function(shuffle){
    this.setState({shuffleActive: shuffle});
  },

  setRepeatMode: function(repeatMode){
    this.setState({repeatMode: repeatMode});
  },

  toggleSync: function(){
    var sync = !this.state.sync;

    if(sync){
      if(!this.state.playlistId)
        PlaylistActions.createAndSync(this.state.playlist);
      else
        PlaylistActions.sync(this.state.playlistId);

    } else {
      PlaylistActions.unsync();
    }
  },

  setPosition: function(p){
    log('set position', p);
    PlaylistActions.changedPlaylist(this.state.playlistId, this.state.playlist, p, this.state.sync);
  },

  setPlaylistChange: function(obj){
    log('set playlist change', obj);
    var playlist = obj.playlist === undefined ? this.state.playlist : obj.playlist;
    var position = obj.position === undefined ? this.state.position : obj.position;

    PlaylistActions.changedPlaylist(this.state.playlistId, playlist, position, this.state.sync);

  },

  playerReady: function(){
    var that = this;
    if(this.state.playlist.length){
      setTimeout(function(){
        that.setPosition(that.state.position === -1 ? 0 : that.state.position);
      }, 50);
    }
  },

  _onChange: function() {
    this.setState({
      playlist: PlaylistStore.getPlaylist(),
      playlistId: PlaylistStore.getPlaylistId(),
      position: PlaylistStore.getPosition(),
      sync: PlaylistStore.getSync(),
      results: SearchStore.getVideos(),
      currentQuery: SearchStore.getCurrentQuery(),
      recentTerms: SearchStore.getRecentTerms(),
      popularPlaylists: PlaylistStore.getPopularPlaylists()
    });

  },

  handleSavePlaylist: function(fn){
    PlaylistActions.save(this.state.playlist, this.state.playlistId, fn);
  },

  hideFeedbackForm: function(){
    this.setState({showFeedbackForm: false});
  },

  showFeedbackForm: function(e){
    this.setState({showFeedbackForm: true});
    return false;
  },

  changeQuery: function(q){
    this.setState({currentQuery: q});
  },

  setHdOnly: function(hdOnly){
    this.setState({hdOnly: hdOnly});
    SearchActions.search(this.state.currentQuery, hdOnly ? 'high' : 'any');
  },

  render: function(){
    return (
      <div id="app">
        <div id="search-component">
          <SearchComponent
            results={this.state.results}
            setResults={this.setResults}
            handleSavePlaylist={this.handleSavePlaylist}
            mode={this.state.mode}
            playlistId={this.state.playlistId}
            toggleSync={this.toggleSync}
            sync={this.state.sync}
            recentTerms={this.state.recentTerms}
            currentQuery={this.state.currentQuery}
            changeQuery={this.changeQuery}
            setHdOnly={this.setHdOnly}
            setPosition={this.setPosition}
            popularPlaylists={this.state.popularPlaylists} />
        </div>
        <div id="player-component">
          <PlayerComponent
            playlist={this.state.playlist}
            setShuffleActive={this.setShuffleActive}
            shuffleActive={this.state.shuffleActive}
            setRepeatMode={this.setRepeatMode}
            repeatMode={this.state.repeatMode}
            position={this.state.position}
            onPlayerReady={this.playerReady}
            setPlaylistChange={this.setPlaylistChange}
            mode={this.state.mode} />
        </div>
        <a id="github-link" href="https://github.com/ruiramos/greatdj" target="_blank" className="desktop">GreatDJ on GitHub</a>
        <Sampler samples={samples} />
      </div>
    )
  }
});

 /**
         <a id="feedback-link" href="#feedback" className="desktop hide" onClick={this.showFeedbackForm}>Send feedback!</a>
        <FeedbackComponent
          show={this.state.showFeedbackForm}
          handleDispose={this.hideFeedbackForm}
        />
  **/

React.render(
  <StateHandler />,
  document.body
);

module.exports = StateHandler;

