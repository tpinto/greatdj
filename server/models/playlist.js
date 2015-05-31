
var geoip = require('geoip-lite');
var baseModel = require('./baseModel');
var _ = require('underscore');
var Errors = require('../constants/Errors');

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
          artists: getPlaylistArtists(pl.playlist),
          videos: pl.playlist
        }
      }));

    });
};

Playlist.getPlaylistDetails = function(id, callback){
  var result = {};

  Playlist.getPlaylistsSummary([id], function(result){
    var plInfo = result ? result[0] : [];
    if(!plInfo) return callback(Errors.PLAYLIST_NOT_FOUND);

    var artists = plInfo.artists.slice(0, 4).map(function(artist){ return artist.name; })

    var desc = artists.reduce(function(memo, current, i){
      return memo + current + ', ';
    }, '').slice(0, -2);
    desc += artists.length > 3 ? ' and others' : '';
    desc += ' in this Great DJ! playlist with '
    desc += plInfo.size !== 1 ? plInfo.size + ' tracks' : '1 track';
    desc += '!';

    // var desc = 'Great playlist with ';
    // desc += plInfo.size !== 1 ? plInfo.size + ' songs ' : '1 song ';
    // desc += 'from artists like ';
    // desc += artists.reduce(function(memo, current, i){
    //   return memo + current + ((i === artists.length - 2) ? ' and ' : ', ')
    // }, '').slice(0, -2);
    // desc += '!';

    result = {
      description: desc,
      videos: plInfo.videos,
      plId: id
    };

    callback(null, result);
  })
}

function getPlaylistArtists(playlist){
  var artists = [];
  var titles = playlist.map(function(pl){ return pl.title });

  titles.forEach(function(title){
    if(title.indexOf('-') === -1){ return; }

    var split = title.split(' - ');

    if(split.length === 1){ // not found
      split = title.split('-'); // no spaces this time
    }

    var artist = split[0]
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
      });
    }
  });

  var sortedArtists = artists.sort(function(a, b){
    return a.count < b.count;
  });

  //console.log(JSON.strinfigy(sortedArtists))

  return sortedArtists;

}

module.exports = Playlist;

