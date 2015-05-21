
var geoip = require('geoip-lite');
var utils = require('../utils');
var _ = require('underscore');
var ERRORS = require('../constants/Errors');

var redis = require("redis"),
    redisClient = redis.createClient();

// Playlist model
var Playlist = require('../models/playlist');

/**
  Controller that saves and loads playlists

**/

var PlaylistController = function(db){
  var api = {};
  Playlist.setup(db);

  // API to be used in Router calls
  api.savePlaylist = function(req, res){
    var ip = utils.getRemoteIpAddress(req);

    if(req.body.id){
      // update - just overwrite for now
      Playlist.update({id: req.body.id}, {$set:{playlist: req.body.playlist}}, function(err, result){
        console.log('update ok ', req.body.id);
        res.send(result);
      });
    } else {
      // insert new record
      var data = req.body;
      data.ip = ip;
      Playlist.createNewPlaylist(data, function(err, result){
        var id = result[0] ? result[0].id : result.ops[0].id; //@todo investigate
        console.log('insert ok ', id);
        res.send({operation: 'insert', id: id});
      });
    }
  };

  api.getPlaylistById = function(req, res){

    Playlist.getPlaylistById(req.query.id, function(err, result){

      if(err){
        res.send(err);
      } else if(!result){
        res.send(ERRORS.PLAYLIST_NOT_FOUND);
      } else {
        // +1 for this playlists popularity!
        if(result.playlist.length){
          redisClient.zincrby('greatdj-popular', 1, req.query.id);
        }

        res.send(result);
      }
    });
  };

  api.getPopularPlaylists = function(req, res){
    redisClient.zrevrange('greatdj-popular', 0, 6, function(err, replies){
      Playlist.getPlaylistsSummary(replies, function(summary){
        var orderedResponse = [];

        replies.forEach(function(plId){
          orderedResponse.push(_.findWhere(summary, {id: plId}));
        });

        res.send({playlists: orderedResponse});

      });
    });
  };

  api.getPlaylistsSummary = function(req, res){
    var ids = req.query.ids.split(',');
    Playlist.getPlaylistsSummary(ids, function(summary){
      res.send({data: summary});
    });
  };

  return api;
};

module.exports = PlaylistController;

