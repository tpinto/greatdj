/**
 * @jsx React.DOM
 */

var React = require('react');

var AutoComplete = require('./AutoComplete');
var Tooltip = require('./Tooltip');
var OverlayTrigger = require('./OverlayTrigger');
var PlaylistActions = require('../actions/PlaylistActions');
var SearchActions = require('../actions/SearchActions');

var request = require('superagent');

// URL for the youtube autocomplete (EN/GB locale)
var youtubeCompleteUrl = 'https://clients1.google.com/complete/search?client=youtube&hl=en&gl=gb&gs_rn=23&gs_ri=youtube&ds=yt&cp=2&gs_id=1a&callback=showAutocompleteOptions&q=';
var autoCompleteTimeout;

var TopBar = React.createClass({
  getInitialState: function(){
    return {
      complete: [],
      selected: -1,
      hideMessage: false
    };
  },

  componentDidMount: function(){
    var that = this;
    window.showAutocompleteOptions = function(res){
      that.setState({complete: res[1] || []});
    };
  },

  handleSubmit: function(e){
    if(e) e.preventDefault();

    if(this.refs.query.getDOMNode().value.trim()){
      if(autoCompleteTimeout){
        clearTimeout(autoCompleteTimeout);
        autoCompleteTimeout = null;
      }

      var q = this.refs.query.getDOMNode().value.trim();
      location.hash = q;

    }

    // reset autocomplete
    this.setState({complete: [], selected: -1});

  },

  // for the autocomplete clicks/selections
  setQuery: function(q){
    this.refs.query.getDOMNode().value = q;
    this.handleSubmit();
  },

  handleInputChange: function(e){
    var q = this.refs.query.getDOMNode().value,
        that = this;

    this.props.changeQuery(q);

    if(autoCompleteTimeout){
      clearTimeout(autoCompleteTimeout);
    }

    autoCompleteTimeout = setTimeout(function(){
      // remove old script tags
      document.querySelectorAll('script.autocompleteJSONP').forEach(function(s){
        s.parentNode.removeChild(s);
      });

      // if there's a query get a new one, otherwise clear
      if(q) {
        var script = document.createElement("script");
        script.setAttribute('class', 'autocompleteJSONP');
        script.setAttribute("src", youtubeCompleteUrl+q);
        document.head.appendChild(script);
      } else {
        that.setState({complete: [], selected: -1});
      }

    }, 250);
  },

  // Autocomplete event handler
  handleInputKeyDown: function(e){
    if(e.keyCode === 38){ //up
      if(this.state.selected >= 0){
        this.setState({selected: this.state.selected - 1});
      }
      // always returning false on up - no 'go to beggining' behaviour
      return false;
    } else if(e.keyCode === 40){ //down
      if(this.state.selected < this.state.complete.length - 1){
        this.setState({selected: this.state.selected + 1});
        return false;
      }
    } else if(e.keyCode === 13 && this.state.selected >= 0){ //enter
      this.setQuery(this.state.complete[this.state.selected][0]);
      return false;
    } else if(e.keyCode === 27){ //esc
      this.setState({complete: [], selected: -1});
      return false;
    }

  },

  handleMouseEnterOption: function(e){
    this.setState({selected: +e.target.getAttribute('data-order')});
  },

  handleMouseLeaveOption: function(e){
    this.setState({selected: -1});
  },

  unsetPlaylistId: function(){
    PlaylistActions.unsetPlaylistId();
  },

  handleSavePlaylist: function(){
    this.props.handleSavePlaylist(this.playlistSaved);
  },

  playlistSaved: function(){
    var that = this;
    this.refs.saveTooltip.show();
    this.refs.saveButton.getDOMNode().classList.add('saved');

    setTimeout(function(){
      that.refs.saveTooltip.hide();
      that.refs.saveButton.getDOMNode().classList.remove('saved');
    }, 4500);
  },

  handleLogoClick: function(e){
    e.preventDefault();
    location.hash = '';
    return false;
  },

  handleHdOnlyChange: function(e){
    var hd = e.target.checked;
    this.props.setHdOnly(hd);
  },

  handleJoinParty: function(e){
    e.preventDefault();
    PlaylistActions.sync(window.DATA.playlists[0]);
    this.handleHideMessage();
  },

  handleHideMessage: function(e){
    if(e) e.preventDefault();
    this.setState({hideMessage: true});
    this.refs.desktopJoinPl.getDOMNode().classList.remove('in');
  },

  render: function() {
    var that = this;
    var labelStyle = this.props.sync ? {display: 'inline-block'} : {display: 'none'};
    var clientStr = this.props.partyClients && this.props.partyClients > 1 ? 'clients' : 'client'

    var showJoinBar;
    console.log(this.props.sync, window.DATA.playlists[0])
    if(window.DATA.playlists[0] && !this.props.sync && !this.state.hideMessage){
      showJoinBar = true;
      setTimeout(function(){
        that.refs.desktopJoinPl.getDOMNode().classList.add('in');
      }, 2000);
    }

    return (
      <div className="top-bar">
        <span className="desktop-join-pl desktop" ref="desktopJoinPl">
          There's a party going on on your network at great.dj/{window.DATA.playlists[0]}!&nbsp;
          <a href="#" onClick={this.handleJoinParty}>Connect?</a>
          <a href="#" onClick={this.handleHideMessage} className="hide-message">x</a>
        </span>

        <form onSubmit={this.handleSubmit} className={this.props.sync ? 'sync' : ''}>
          <span className="logo-label-container">
            <span className="logo desktop"><a href="/" onClick={this.handleLogoClick}>GREAT DJ<span className="it">!</span></a></span>
            <span className="label" style={labelStyle}>{this.props.partyClients} {clientStr}</span>
          </span>
          <input type="text" className="q" ref="query" onChange={this.handleInputChange} onKeyDown={this.handleInputKeyDown}
          placeholder="Search for music videos here..." value={this.props.currentQuery} />
          <input type="submit" value="Search" />
          <input type="checkbox" className="desktop" value="HD Only" id="hd-checkbox" onChange={this.handleHdOnlyChange} /><label htmlFor="hd-checkbox"> HD Only </label>

          <div className="toolbox">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>With party mode on, multiple devices can control this playlist.</Tooltip>}>
              <button className={this.props.sync ? 'sync active' : 'sync'} type="button" onClick={this.props.toggleSync}>
                Party Mode
              </button>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip>Your playlist id. Click the <strong>x</strong> to go on a new one.</Tooltip>}>
              <span className="playlist-id" style={this.props.playlistId ? {} : {display: 'none'}}>
                {this.props.playlistId}
                <i className="fa fa-times" onClick={this.unsetPlaylistId}></i>
              </span>
            </OverlayTrigger>

            <OverlayTrigger ref="saveTooltip" placement="bottom" trigger="manual" overlay={<Tooltip moreClasses="save">Saved. Share this URL with the world!</Tooltip>}>
              <button className="save" ref="saveButton" type="button" onClick={this.handleSavePlaylist}>
                Save
              </button>
            </OverlayTrigger>
          </div>

          <AutoComplete
            complete={this.state.complete}
            selected={this.state.selected}
            setQuery={this.setQuery}
            handleMouseEnterOption={this.handleMouseEnterOption}
            handleMouseLeaveOption={this.handleMouseLeaveOption} />

        </form>
      </div>
    );
  }

});

module.exports = TopBar;