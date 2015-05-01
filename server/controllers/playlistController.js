
var geoip = require('geoip-lite');
var utils = require('../utils');

// Playlist model
var playlist = require('../models/playlist');

/**
  Controller that saves and loads playlists

**/

var PlaylistController = function(db){
  var api = {};
  var Playlist = playlist(db);

  // API to be used in Router calls
  api.savePlaylist = function(req, res){
    var ip = utils.getRemoteIpAddress(req);

    if(req.body.id){
      // update - just overwrite for now
      Playlist.update(req.body.id, req.body, res.send.bind(res));
    } else {
      // insert new record
      var data = req.body;
      data.ip = ip;
      Playlist.createNewPlaylist(data, res.send.bind(res));
    }
  };

  api.getPlaylistById = function(req, res){
    Playlist.getPlaylistById(req.query.id, res.send.bind(res));
  };

  api.getPopularPlaylists = function(req, res){
    //@todo
  };

  return api;
};

module.exports = PlaylistController;

