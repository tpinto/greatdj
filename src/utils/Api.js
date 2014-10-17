
var request = require('superagent');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');
var io = require('socket.io-client');

// Youtube API Key
var API_KEY = 'AIzaSyDLwX06yG_73ImDEubOb5Yv0E_U1iIdTJs';

var socketIoUrl = (window.location.href.indexOf('localhost') >= 0 ? '' : 'http://great.dj:8090');

function dispatch(key, response, params) {
    var payload = {actionType: key, response: response};
    if (params) {
        payload.queryParams = params;
    }
    AppDispatcher.handleServerAction(payload);
}

var Api = {
  savePlaylist: function(pl, plId, fn) {
    var key = Constants.PLAYLIST_SAVED;
    var params = {playlist: pl, id: plId};

    dispatch(key, Constants.request.PENDING, params);

    request
      .post('/p')
      .send(params)
      .end(function(err, response){
        if(!err && response.body.id){
          dispatch(key, {playlistId: response.body.id, callback: fn}, params);
        } else {
          dispatch(key, Constants.request.ERROR, params);
        }
      });

  },

  loadPlaylist: function(plId){
    var key = Constants.PLAYLIST_LOADED;
    var params = {id: plId};

    dispatch(key, Constants.request.PENDING, params);

    request
        .get('/p')
        .query(params)
        .end(function(err, response){
          if(!err && response.body.id){
            dispatch(key, {playlist: response.body.playlist, playlistId: response.body.id}, params);
          } else {
            dispatch(key, Constants.request.ERROR, params);
          }
        });

  },

  searchForVideos: function(q, videoDef){
    var key = Constants.SEARCH_SUCCESS;

    request
      .get('https://www.googleapis.com/youtube/v3/search')
      .query({
        key: API_KEY,
        part: 'snippet',
        q: q,
        type: 'video',
        maxResults: 20,
        videoDefinition: videoDef
      })
      .end(function(err, response){
        dispatch(key, {items: response.body.items});
      });

    request
      .post('/s')
      .send({term: q})
      .end();

  },

  getRecentTerms: function(){
    var key = Constants.RECENT_TERMS;
    request
      .get('/s')
      .end(function(err, response){
        dispatch(key, {terms: response.body.terms});
      });
  }
};

Api.io = {
  socket: null,
  register: function(id){
    if(!this.socket){
      this.socket = io(socketIoUrl);

      this.socket.on('playlistChange', function(data){
        console.log('received playlist changed', data)
        dispatch(Constants.PLAYLIST_LOADED, {playlist: data.playlist, playlistId: data.id, position: data.position}, {id: data.id});
      });
    }

    this.socket.emit('register', {id: id});

  },
  changedPlaylist: function(id, pl, pos){
    if(this.socket)
      this.socket.emit('changedPlaylist', {id: id, playlist: pl, position: pos});
  },
  unregister: function(){
    if(this.socket){
      this.socket.off('playlistChange');
      this.socket.emit('unregister');
      this.socket = null;
    }
  }
};


 module.exports = Api;