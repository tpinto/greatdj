
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/AppConstants');
var CHANGE_EVENT = Constants.CHANGE_EVENT;
var objectAssign = require('object-assign');
var log = require('bows')('PlaylistStore');

var _playlist = [];
var _playlistId;
var _position = -1;
var _sync = false;
var _popular = [];

function saved(plId){
  _playlistId = plId;
  history.pushState(null, null, '/'+plId);
}

function loaded(data){
  _playlist = data.playlist;
  _playlistId = data.playlistId;
  _position = (data.position === undefined ? _position : data.position); // zero is a valid value!
}

function setSyncTo(sync){
  _sync = sync;
}

function setPopularPlaylists(pls){
  _popular = pls;
}

var PlaylistStore = objectAssign(EventEmitter.prototype, {

  getPlaylist: function(){
    return _playlist;
  },

  getPlaylistId: function(){
    return _playlistId;
  },

  getPosition: function(){
    return _position;
  },

  getSync: function(){
    return _sync;
  },

  getPopularPlaylists: function(){
    return _popular;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case Constants.PLAYLIST_SAVED:
      if(action.response === Constants.request.PENDING){
        /// tururur
      } else if(action.response.playlistId){
        saved(action.response.playlistId);

        // if(action.response.callback){
        //   log('calling callback with ', action.response.playlistId);
        //   action.response.callback(action.response.playlistId);
        // }

        PlaylistStore.emitChange();
      }
      break;

    case Constants.PLAYLIST_LOADED:
      if(action.response === Constants.request.PENDING){
        /// tururur wait for iit

      } else if(action.response.playlistId){
        log('Playlist loaded', action.response);
        loaded(action.response);
        PlaylistStore.emitChange();
      }
      break;

    case Constants.SYNC_OFF:
      log('turning off sync');
      setSyncTo(false);
      PlaylistStore.emitChange();
      break;

    case Constants.SYNC_ON:
      log('turning sync on');
      setSyncTo(true);
      PlaylistStore.emitChange();
      break;

    case Constants.PLAYLIST_CHANGE:
      log('playlist change', action.response);
      loaded(action.response);
      PlaylistStore.emitChange();
      break;

    case Constants.UNSET_PLAYLIST_ID:
      _playlistId = undefined;
      history.pushState(null, null, '/');
      PlaylistStore.emitChange();
      break;

    case Constants.SET_PLAYLIST_ID:
      _playlistId = action.response.id;
        history.pushState(null, null, '/'+action.response.id);
      PlaylistStore.emitChange();
      break;

    case Constants.POPULAR_PLAYLISTS:
      setPopularPlaylists(action.response.playlists);
      PlaylistStore.emitChange();
      break;

    default:
      return true;
  }

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = PlaylistStore;
