
var geoip = require('geoip-lite');
var baseModel = require('./baseModel');
var _ = require('underscore');

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

Playlist.getPlaylistsSummary = function(ids, callback){
  var summary = [];

  Playlist.db.collection(Playlist.model)
    .find({id: {$in: ids}})
    .toArray(function(err, pls){

      callback(pls.map(function(pl){
        return {
          id: pl.id,
          size: pl.playlist.length,
          artists: getPlaylistArtists(pl.playlist)
        }
      }));

    });
};

function getPlaylistArtists(playlist){
  var artists = [];
  var titles = playlist.map(function(pl){ return pl.title });

  titles.forEach(function(title){
    if(title.indexOf('-') === -1){ return; }

    var split = title.split('-'),
        artist = split[0]
          .trim()
          .toLowerCase()
          .replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });

    var artistPos = _.findWhere(artists, {name: artist});
    if(artistPos){
      artistPos.count += 1;
    } else {
      artists.push({
        name: artist,
        count: 1
      })
    };
  });

  var sortedArtists = artists.sort(function(a, b){
    return a.count < b.count;
  });

  return sortedArtists;

}

module.exports = Playlist;

