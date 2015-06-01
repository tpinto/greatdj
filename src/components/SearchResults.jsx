 /**
  * @jsx React.DOM
  */

var React = require('react'),
    IntroComponent = require('./IntroComponent');

var SearchResults = React.createClass({
  handleVideoEnqueue: function(video){
    this.props.enqueueHandler(video);
    return false;
  },

  handlePlayNow: function(video){
    this.props.playNowHandler(video);
    return false;
  },

  render: function() {
    var resultsList = this.props.videos.map(function(res, i){
      var rowClassName = 'row ' + (i % 2 ? 'odd' : 'even');

      var pos = this.props.getPlaylistPosition(res.id);

      if(pos > 0){
        rowClassName += ' in-queue';
      } else if(pos === 0){
        rowClassName += ' playing'
      } else if(pos < 0){
        rowClassName += ' played'
      }

      return (
        <tr key={res.id} className={rowClassName}>
          <td className="imgTd">
            <a onClick={this.handleVideoEnqueue.bind(this, res)} href="#">
              <img className="thumbnail" src={ res.snippet.thumbnail } />
            </a>
          </td>
          <td className="descTd">
            <a onClick={this.handleVideoEnqueue.bind(this, res)} href="#">
              { res.snippet.title }
            </a>
            <i className={"source fa fa-"+res.source}></i>
            <p className="entry-state in-queue">
              <i className="fa" />
              In Queue
            </p>
            <p className="entry-state playing">
              <i className="fa" />
              Currently playing!
            </p>
            <p className="entry-state played">
              <i className="fa" />
              Already played
            </p>
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
        // popular searches vs popular playlists (includes...)
        <IntroComponent
          recentTerms={this.props.recentTerms}
          popularPlaylists={this.props.popularPlaylists}
          setPosition={this.props.setPosition}
           />
      );
    }
  }

 });

module.exports = SearchResults;

