
var geoip = require('geoip-lite');
var baseModel = require('./baseModel');

var Playlist = Object.create(baseModel);


Playlist.setup = function(db){
    Playlist.init(db, 'playlists');
};

Playlist.createNewPlaylist = function(data, callback){
    var id = Math.random().toString(36).slice(3,9); // revisit
    var geo = geoip.lookup(data.ip);

    var doc = {id: id, playlist: data.playlist, ip: data.ip, geo: geo, created: new Date()};
    Playlist.insert(doc, {w:1}, callback);
};

  // returns 1 playlist, querying by id
Playlist.getPlaylistById = function(id, callback){
    Playlist.db.collection(Playlist.model).findOne({id: id}, callback);
};


module.exports = Playlist;

