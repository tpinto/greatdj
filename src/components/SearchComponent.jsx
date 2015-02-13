 /**
  * @jsx React.DOM
  */

var React = require('react');
var request = require('superagent');

var SearchResults = require('./SearchResults');
var SearchActions = require('../actions/SearchActions');
var ResultsComponent = require('./ResultsComponent');
var TopBar = require('./TopBar');

var API_KEY = 'AIzaSyDLwX06yG_73ImDEubOb5Yv0E_U1iIdTJs';

var SearchComponent = React.createClass({

  videoEnqueued: function(id, title, type){
    var evt = new CustomEvent('enqueue',
      {'detail': {
        'type': type,
        'title': title,
        'videoId': id,
      }
    });
    window.dispatchEvent(evt);
  },

  playNowHandler: function(id, title, type){
    var evt = new CustomEvent('playNow',
      {'detail': {
        'type': type,
        'title': title,
        'videoId': id,
      }
    });
    window.dispatchEvent(evt);
  },

  handleSubmit: function(q, hdOnly){
    var that = this,
        videoDef = hdOnly ? 'high' : 'any';

    SearchActions.search(q, videoDef);

  },

  render: function() {
    return (
      <div>
        <TopBar
          handleSubmit={this.handleSubmit}
          handleSavePlaylist={this.props.handleSavePlaylist}
          playlistId={this.props.playlistId}
          unsetPlaylistId={this.props.unsetPlaylistId}
          toggleSync={this.props.toggleSync}
          sync={this.props.sync}
          currentQuery={this.props.currentQuery}
          changeQuery={this.props.changeQuery} />

        <SearchResults
          handleSubmitQuery={this.handleSubmit}
          videos={this.props.results}
          enqueueHandler={this.videoEnqueued}
          playNowHandler={this.playNowHandler}
          recentTerms={this.props.recentTerms} />
      </div>
    );
  },
});


module.exports = SearchComponent;

