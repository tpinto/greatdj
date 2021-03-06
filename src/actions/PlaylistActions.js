
var Api = require('../utils/Api');
var Constants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var PlaylistActions = {

  /**
   * @param  {string} text
   */
  save: function(pl, plId, fn) {
    AppDispatcher.handleViewAction({
      actionType: Constants.PLAYLIST_SAVE
    });

    Api.savePlaylist(pl, plId, fn);

  },

  /**
   * @param  {string} text
   */
  createAndSync: function(pl, pos) {
    AppDispatcher.handleViewAction({
      actionType: Constants.PLAYLIST_SAVE
    });

    Api.savePlaylist(pl, null, function(plId){
      PlaylistActions.sync(plId, pl, pos);
    });

  },

  /**
   * @param  {string} id
   */
  load: function(plId, fn) {
    console.log('load', plId);
    Api.loadPlaylist(plId, fn);
  },

  sync: function(plId, pl, pos){
    console.log('sync', plId);
    AppDispatcher.handleViewAction({
      actionType: Constants.SYNC_ON
    });

    Api.io.register(plId, pl, pos);
  },

  unsync: function(){
    console.log('unsync');
    Api.io.unregister();

    AppDispatcher.handleViewAction({
      actionType: Constants.SYNC_OFF
    });
  },

  changedPlaylist: function(plId, pl, pos, sync){
    AppDispatcher.handleViewAction({
      actionType: Constants.PLAYLIST_CHANGE,
      response:{
        playlistId: plId,
        playlist: pl,
        position: pos
      }
    });

    if(sync){
      console.log('sending changedPlaylist', plId, pl, pos);
      Api.io.changedPlaylist(plId, pl, pos);
    }
  },

  unsetPlaylistId: function(){
    AppDispatcher.handleViewAction({
      actionType: Constants.UNSET_PLAYLIST_ID,
    });

    PlaylistActions.unsync();
  },

  setPlaylistId: function(id){
    AppDispatcher.handleViewAction({
      actionType: Constants.SET_PLAYLIST_ID,
      response: {id: id}
    });
  },

  getPopularPlaylists: function(){
    Api.getPopularPlaylists();
  }

};

module.exports = PlaylistActions;
