 /**
  * @jsx React.DOM
  */

var React = require('react');

var SearchResults = React.createClass({
  handleVideoEnqueue: function(video){
    this.props.enqueueHandler(video.id.videoId || video.id, video.snippet.title, 'youtube');
    return false;
  },

  handlePlayNow: function(video){
    this.props.playNowHandler(video.id.videoId || video.id, video.snippet.title, 'youtube');
    return false;
  },

  render: function() {
    var resultsList = this.props.videos.map(function(res, i){
      var rowClassName = 'row ' + (i % 2 ? 'odd' : 'even');
      return (
        <tr key={res.id.videoId} className={rowClassName}>
          <td className="imgTd">
            <a onClick={this.handleVideoEnqueue.bind(this, res)} href="#">
              <img className="thumbnail" src={ res.snippet.thumbnails.medium.url } />
            </a>
          </td>
          <td className="descTd">
            <a onClick={this.handleVideoEnqueue.bind(this, res)} href="#">
              { res.snippet.title }
            </a>
            <div className="mobile">
              <button ref="enq" className="primary" onClick={this.handleVideoEnqueue.bind(this, res)}>Enqueue</button>
              <button ref="play" onClick={this.handlePlayNow.bind(this, res)}>Play now</button>
            </div>
          </td>
          <td className="buttonTd desktop">
            <button ref="enq" className="primary" onClick={this.handleVideoEnqueue.bind(this, res)}>Enqueue</button>
            <button ref="play" onClick={this.handlePlayNow.bind(this, res)}>Play now</button>
          </td>
        </tr>
      )
    }, this)

    var recentSearches = this.props.recentTerms ? this.props.recentTerms.map(function(term){
      return (
        <li><a href={ '#' + term}>{ term }</a></li>
      );
    }, this) : [<li><a href="#radiohead">radiohead</a></li>];

    recentSearches.reverse();

    if(resultsList.length){
      return (
        <div className="results-container">
          <table className="results">
            <thead>
            </thead>
            <tbody>
              { resultsList }
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="results-container results-intro">
          <div className="intro">
            <h1>Create, save and share Youtube playlists, the easy way!</h1>

            <div className="box desktop">
              <h3><i className="fa fa-save"></i><span>Save and Share playlists</span></h3>
              <p>Save your playlist and it will generate a unique URL that you can share with your friends, or even with enemies! (the playlists aren't actually saved in floppy disks, unfortunately)</p>
            </div>
            <div className="box desktop">
              <h3><i className="fa fa-refresh"></i><span>Party Mode</span></h3>
              <p>If you enable <strong>Party Mode</strong>™ on multiple devices connected to the same playlist, they will all be in sync.
              Try to use your phone to add/remove songs and to change what's currently playing!</p>
            </div>

            <div className="box desktop">
              <h3><i className="fa fa-bookmark"></i><span>Chrome Extension</span></h3>
              <p>Download our <a href="https://chrome.google.com/webstore/detail/greatdj/fobgllhmkmfdjnboijodmohifllnhigc" target="_blank"><strong>new Chrome Extension</strong></a> and you'll never lose a playlist again!
              All the playlists you create or access will be available through the extension, for maximum convenience.
              </p>
            </div>


            <h3>Some recent searches to get you started...</h3>
            <ul> { recentSearches } </ul>

          </div>
        </div>
      );
    }
  }

 });

module.exports = SearchResults;

