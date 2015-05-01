
var geoip = require('geoip-lite');
var baseModel = require('./baseModel');

var Playlist = function(db){
  var self = baseModel(db, 'playlist');

  // creates and inserts new playlist
  self.createNewPlaylist = function(data, callback){
    var id = Math.random().toString(36).slice(3,9); // revisit
    var geo = geoip.lookup(data.ip);

    var doc = {id: id, playlist: data.playlist, ip: data.ip, geo: geo, created: new Date()};

    self.insert(doc, {w:1}, function(err, result) {
      console.log('insert ok ', id);
      callback({operation: 'insert', id: id});
    });
  }

  // returns 1 playlist, querying by id
  self.getPlaylistById = function(id, callback){
    db.collection('playlists').findOne({id: id}, function(err, item) {
      callback(item);
    });
  };

  return self;
}

module.exports = Playlist;

