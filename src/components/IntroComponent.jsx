 /**
  * @jsx React.DOM
  */

var React = require('react');

var IntroComponent = React.createClass({

  render: function() {
    var recentSearchesArr = this.props.recentTerms || ['radiohead', 'ag cook', 'earth wind fire'];

    var recentSearches = recentSearchesArr.map(function(term){
      return (
        <li><a href={ '#' + term}>{ term }</a></li>
      );
    }, this);

    recentSearches.reverse();

    var popPlaylistsArr = this.props.popularPlaylists || [];

    var popularPlaylists = popPlaylistsArr.map(function(id){
      return (
        <li><a href={ '/' + id}>{ "http://great.dj/" + id }</a></li>
      );
    })

    return (
      <div className="results-container results-intro">
        <div className="intro">
          <h1>Create, save and share Youtube playlists, the easy way!</h1>

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
              <h3>Some popular playlists...</h3>
              <ul> {popularPlaylists} </ul>
            </div>
          </div>

        </div>
      </div>
    );
  }

});

module.exports = IntroComponent;