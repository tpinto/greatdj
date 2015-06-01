var mongo = require('mongodb').MongoClient;
var config = require('../server.conf.json')[process.env.ENV || 'local'];

mongo.connect(config.MONGODB_URL, function(err, db) {
  if(err){
    console.log('* Error: database connection failed. Check if mongo is running?');
    return;
  }

  var pls = db.collection('playlists').find().toArray(function(err, records){
    records.map(function(record){
      console.log(record)
      var newpl = record.playlist.map(function(song){
        if(!song.id) song.id = song.videoId;
        song.source = song.type;
        song.snippet = song.snippet || {};
        song.snippet.title = song.title || 'teste title';
        return song;
      });

      db.collection('playlists').update({'_id': record._id}, {$set: {playlist: newpl}});
    });
  })
});