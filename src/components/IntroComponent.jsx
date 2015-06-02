 /**
  * @jsx React.DOM
  */

var React = require('react');
var PlaylistActions = require('../actions/PlaylistActions');

var IntroComponent = React.createClass({

  handlePlaylistLoad: function(e){
    e.preventDefault();
    var that = this;

    var plId = e.target.attributes['data-id'].value;
    that.props.setPosition(-1);

    PlaylistActions.load(plId, function(){
      that.props.setPosition(0);
    });

    history.pushState(null, null, '/'+plId);
  },

  render: function() {
    var recentSearchesArr = this.props.recentTerms.length ?
      this.props.recentTerms : ['radiohead', 'ag cook', 'earth wind fire', 'beyonce', 'kero kero bonito', 'minaj'];

    var recentSearches = recentSearchesArr.map(function(term){
      return (
        <li><a href={ '#' + term}>{ term }</a></li>
      );
    }, this);

    recentSearches.reverse();

    var popPlaylistsArr = this.props.popularPlaylists || [];

    var popularPlaylists = popPlaylistsArr.map(function(pl){
      if(pl){
        var artists = pl.artists.slice(0, 3).map(function(artist){ return artist.name; });

        return (
          <li className="popular-playlist">
            <a href={ '/' + pl.id} data-id={pl.id} onClick={ this.handlePlaylistLoad }>{ "http://great.dj/" + pl.id }</a>
            <p className="popular-summary">{pl.size} songs, including { artists.join(', ') }.</p>
          </li>
        );
      }
    }, this)

    return (
      <div className="results-container results-intro">
        <div className="intro">
          <h1>Create, save and share music playlists, the easy way!</h1>
          <p className="subtitle">Now with both
            <span className="black">Youtube <i className="fa fa-youtube"></i></span> and
            <span className="black">Soundcloud <i className="fa fa-soundcloud"></i></span>
            support!
          </p>
          <div className="box desktop">
            <h3>
              <i className="fa fa-save"></i>
              <span>Save and Share playlists</span></h3>
            <p>
              Save your playlist and it will generate a unique URL that you can share with your
              friends, or even with enemies! (the playlists aren't actually saved in floppy disks, unfortunately)
            </p>
          </div>
          <div className="box desktop">
            <h3>
              <i className="fa fa-refresh"></i>
              <span>Party Mode</span>
            </h3>
            <p>If you enable <strong>Party Mode</strong>™ on multiple devices connected to the same
            playlist, they will all be in sync. Try to use your phone to add/remove songs and to change
            what's currently playing!</p>
          </div>

          <div className="box desktop">
            <h3><i className="fa fa-bookmark"></i><span>Chrome Extension</span></h3>
            <p>
              Download our <a href="https://chrome.google.com/webstore/detail/greatdj/fobgllhmkmfdjnboijodmohifllnhigc" target="_blank">
                <strong>new Chrome Extension</strong>
              </a> and you'll never lose a playlist again!
              All the playlists you create or access will be available through the extension, for maximum convenience.
            </p>
          </div>

          <div className="teasers">
            <div className="box">
              <h3>Some recent searches to get you started...</h3>
              <ul> { recentSearches } </ul>
            </div>
            <div className="box">
              <h3>Or try one of these popular playlists!</h3>
              <ul className="popular-playlists"> {popularPlaylists} </ul>
            </div>
          </div>

        </div>
      </div>
    );
  }

});

module.exports = IntroComponent;