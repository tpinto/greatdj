 /**
  * @jsx React.DOM
  */

var React = require('react');
var request = require('superagent');

var SearchResults = require('./SearchResults');
var PlayerComponent = require('./PlayerComponent');
var TopBar = require('./TopBar');

var API_KEY = 'AIzaSyDLwX06yG_73ImDEubOb5Yv0E_U1iIdTJs';

var SearchComponent = React.createClass({

  videoEnqueued: function(video){
    var evt = new CustomEvent('enqueue',
      {'detail': {
        'video': video,
      }
    });
    window.dispatchEvent(evt);
  },

  playNowHandler: function(video){
    var evt = new CustomEvent('playNow',
      {'detail': {
        'video': video,
      }
    });
    window.dispatchEvent(evt);
  },

  render: function() {
    return (
      <div>
        <TopBar
          handleSavePlaylist={this.props.handleSavePlaylist}
          playlistId={this.props.playlistId}
          unsetPlaylistId={this.props.unsetPlaylistId}
          toggleSync={this.props.toggleSync}
          sync={this.props.sync}
          currentQuery={this.props.currentQuery}
          changeQuery={this.props.changeQuery}
          setHdOnly={this.props.setHdOnly}
          partyClients={this.props.partyClients}
          setPosition={this.props.setPosition}
          />

        <SearchResults
          videos={this.props.results}
          enqueueHandler={this.videoEnqueued}
          playNowHandler={this.playNowHandler}
          recentTerms={this.props.recentTerms}
          popularPlaylists={this.props.popularPlaylists}
          setPosition={this.props.setPosition}
          getPlaylistPosition={this.props.getPlaylistPosition}
          />
      </div>
    );
  },
});


module.exports = SearchComponent;

