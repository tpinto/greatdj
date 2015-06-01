
var request = require('superagent');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/AppConstants');
var io = require('socket.io-client');
var log = require('bows')('Api');

// Youtube API Key
var API_KEY = 'AIzaSyDLwX06yG_73ImDEubOb5Yv0E_U1iIdTJs';

var socketIoUrl =
  (window.location.href.indexOf('localhost') >= 0 ? '' :
    window.STAGING ? 'http://great.dj:8190' : 'http://great.dj:8090');

log('socket url:', socketIoUrl, window.STAGING);

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
        if(!err){
          if(response.body.id){ // new playlist just created
            dispatch(key, {playlistId: response.body.id}, params);
          }

          if(fn){
            fn(response.body.id);
          }
        } else {
          dispatch(key, Constants.request.ERROR, params);
        }
      });

  },

  loadPlaylist: function(plId, fn){
    var key = Constants.PLAYLIST_LOADED;
    var params = {id: plId};

    dispatch(key, Constants.request.PENDING, params);

    request
        .get('/p')
        .query(params)
        .end(function(err, response){
          if(!err && response.body.id){
            dispatch(key, {playlist: response.body.playlist, playlistId: response.body.id}, params);
            if(fn) {
              fn();
            }
          } else {
            dispatch(key, Constants.request.ERROR, params);
          }
        });

  },

  searchForVideos: function(q, videoDef){
    var key = Constants.SEARCH_SUCCESS;

    // Youtube
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
       var items = response.body.items.map(function(video){
        console.log(video)
         return {
          id: video.id.videoId,
          source: 'youtube',
          snippet: {
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url
          },
          url: 'http://www.youtube.com/watch?v=' + video.id.videoId
        }
      });

       dispatch(key, {items: items});

      });

    // Soundcloud
    SC.get('/tracks', {q: q, limit: 20}, function(tracks) {
      var items = tracks.map(function(track){
         return {
          id: track.id,
          source: 'soundcloud',
          snippet: {
            title: track.title,
            thumbnail: track.artwork_url
          },
          url: track.uri
        }
      })

      dispatch(key, {items: items});

    });

    request
      .post('/s')
      .send({term: q})
      .end();

  },

  getVideosFromUrl: function(url){
    var key = Constants.SEARCH_SUCCESS;

    request
      .post('/url_s')
      .send({
        url: url,
      })
      .end(function(err, response){
        dispatch(key, {items: response.body.items});
      });
  },

  getFacebookPageVideos: function(id){
    var key = Constants.SEARCH_SUCCESS;

    request
      .post('/fb_s')
      .send({
        id: id,
      })
      .end(function(err, response){
        dispatch(key, {items: response.body.items});
      });
  },

  getRecentTerms: function(){
    var key = Constants.RECENT_TERMS;
    request
      .get('/s')
      .end(function(err, response){
        dispatch(key, {terms: response.body.terms});
      });
  },

  getPopularPlaylists: function(){
    var key = Constants.POPULAR_PLAYLISTS;
    request
      .get('/popular')
      .end(function(err, response){
        dispatch(key, {playlists: response.body.playlists});
      });
  }
};

Api.io = {
  socket: undefined,
  playlistVersion: undefined,

  register: function(id, playlist, position){
    var that = this;

    if(!this.socket){
      this.socket = io(socketIoUrl);

      this.socket.on('playlistChange', function(data){
        log('* Received playlist changed', data);

        // timestamp of the playlist we received
        // we will include it in future changedPlaylist requessts so the server
        // knows if the client is based on the latest available version
        that.playlistVersion = data.ts;

        dispatch(Constants.PLAYLIST_LOADED, {
          playlist: data.playlist,
          playlistId: data.id,
          position: data.position,
          ts: data.ts
        }, {id: data.id});
      });

      this.socket.on('disconnect', function(){
        // server disconnected? turning party mode off
        dispatch(Constants.SYNC_OFF);
        that.shouldReconnect = true;
      });

      this.socket.on('connect', function(){
        // hande reconnections on mobile due to innactivity / putting the browser in background...
        if(that.shoudReconnect){
          that.socket.emit('register', {id: id});
        }
      });

      this.socket.on('presence', function(data){
        dispatch(Constants.PARTY_PRESENCE, {
          clients: data.clients
        });
      })
    }

    this.socket.emit('register', {id: id, playlist: playlist, position: position});
  },

  changedPlaylist: function(id, pl, pos){
    if(this.socket){
      this.socket.emit('changedPlaylist', {id: id, playlist: pl, position: pos, ts: this.playlistVersion});
    } else {
      console.warn('Tried to send a changedPlaylist but socket not available');
    }
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

