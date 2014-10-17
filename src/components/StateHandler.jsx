 /**
  * @jsx React.DOM
  */

var React = require('react');
var urllite = require('urllite');
var isMobile = require('ismobilejs');

var SearchComponent = require('./SearchComponent');
var ResultsComponent = require('./ResultsComponent');
var FeedbackComponent = require('./FeedbackComponent');
var PlaylistStore = require('../stores/PlaylistStore');
var SearchStore = require('../stores/SearchStore');
var PlaylistActions = require('../actions/PlaylistActions');

var ReactTransitionGroup = React.addons.TransitionGroup;

var StateHandler = React.createClass({
  getInitialState: function(){
    return {
      playlist: PlaylistStore.getPlaylist(),
      results: SearchStore.getVideos(),
      recentTerms: SearchStore.getRecentTerms(),
      position: PlaylistStore.getPosition(),
      playlistId: PlaylistStore.getPlaylistId(),
      sync: false,
      currentQuery: SearchStore.getCurrentQuery(),
      showFeedbackForm: false
    }
  },

  componentWillMount: function(){
    PlaylistStore.addChangeListener(this._onChange);
    SearchStore.addChangeListener(this._onChange);

    var url = urllite(document.location.href),
        that = this,
        id;

    if(window.playlists){
      id = window.playlists[0];
      history.pushState(null, null, '/'+id);

      this.setState({sync: true});
      PlaylistActions.sync(id);

    } else if(url.pathname.length > 1){
      // do a server request with url.hash
      id = url.pathname.slice(1);
      PlaylistActions.load(id);
    }

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

    this.setState({sync: sync});
  },

  setPlaylist: function(pl){ console.log('set playlist', pl)
    PlaylistActions.changedPlaylist(this.state.playlistId, pl, this.state.position);
  },

  setPosition: function(p){ console.log('set position', p)
    PlaylistActions.changedPlaylist(this.state.playlistId, this.state.playlist, p);
  },

  playerReady: function(){
    var that = this;
    if(this.state.playlist.length){
      setTimeout(function(){that.setPosition(that.state.position === -1 ? 0 : that.state.position), 50});
    }
  },

  _onChange: function() {
    this.setState({
      playlist: PlaylistStore.getPlaylist(),
      playlistId: PlaylistStore.getPlaylistId(),
      position: PlaylistStore.getPosition(),
      sync: (PlaylistStore.getPlaylistId() ? this.state.sync : false),
      results: SearchStore.getVideos(),
      currentQuery: SearchStore.getCurrentQuery(),
      recentTerms: SearchStore.getRecentTerms(),
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
    console.log(q);
    this.setState({currentQuery: q});
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
            />
        </div>
        <div id="player-component">
          <ResultsComponent
            playlist={this.state.playlist}
            setPlaylist={this.setPlaylist}
            position={this.state.position}
            setPosition={this.setPosition}
            onPlayerReady={this.playerReady}
            mode={this.state.mode} />
        </div>
        <a id="github-link" href="https://github.com/ruiramos/greatdj" target="_blank" className="desktop">GreatDJ on GitHub</a>
        <a id="feedback-link" href="#feedback" className="desktop hide" onClick={this.showFeedbackForm}>Send feedback!</a>
        <FeedbackComponent
          show={this.state.showFeedbackForm}
          handleDispose={this.hideFeedbackForm}
        />
      </div>
    )
  }

});

React.renderComponent(
  <StateHandler />,
  document.body
);

module.exports = StateHandler;

