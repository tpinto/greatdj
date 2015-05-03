
var playlistClients = {};
var latestVersion = {};

var Playlist = require('./models/playlist'),
    Parties = require('./models/party');
/**
  Controller for the party mode sync bit

*/

var socketServer = function(io, db){
  Playlist.setup(db);
  Parties.setup(db);

  // socket io for realtime updates on playlists across clients
  io.on('connection', function(socket){
    // socket is the client socket
    // global vars that belong to each socket
    var plId;
    var myIp;

    console.log(' * new connection');

    socket.on('register', function(data){
      console.log(' * client connected', data.id);

      playlistClients[data.id] = playlistClients[data.id] || [];
      playlistClients[data.id].push(socket);
      plId = data.id;

      if(playlistClients[data.id].length > 1 && latestVersion[data.id]){
        socket.emit('playlistChange', latestVersion[data.id]);
      } else {
        Playlist.getPlaylistById(data.id, function(err, data){
          socket.emit('playlistChange', data);
        });
      }

      Parties.connectClient(socket.request.connection.remoteAddress, data.id);
      myIp = socket.request.connection.remoteAddress;

    });

    socket.on('disconnect', function(){
      console.log(' * client disconnected/unregisted', plId);
      //remove from playlistClients playlistClients
      if(plId){
        for (var i = playlistClients[plId].length - 1; i >= 0; i--) {
          if(playlistClients[plId][i] === socket){
            playlistClients[plId].splice(i, 1);
            break;
          }
        }

        if(!playlistClients[plId].length){
          latestVersion[plId] = null;
        }

        Parties.disconnectClient(myIp, plId);
        plId = null;

      }
    });

    socket.on('unregister', function(){
      console.log(' * client disconnected/unregisted', plId);
      //remove from playlistClients playlistClients
      if(plId){
        for (var i = playlistClients[plId].length - 1; i >= 0; i--) {
          if(playlistClients[plId][i] === socket){
            playlistClients[plId].splice(i, 1);
            break;
          }
        }

        if(!playlistClients[plId].length){
          latestVersion[plId] = null;
        }

        Parties.disconnectClient(myIp, plId);
        plId = null;

      }
    });

    socket.on('changedPlaylist', function(data){
      console.log(' * changedPlaylist:', data.id);

      if(!latestVersion[data.id] ||
        (latestVersion[data.id] && latestVersion[data.id].ts === data.ts)){

        data.ts = new Date().getTime();
        latestVersion[data.id] = data;

        for (var i = playlistClients[data.id].length - 1; i >= 0; i--) {
          var subscriber = playlistClients[data.id][i];
          //if(subscriber !== socket){
            subscriber.emit('playlistChange', data);
          //}
        }
      } else {
        // client based on an old version of the pl, gonna send the actual one for now
        // would be nice to have some sort of diff here...
        console.log('* Getting client up to date with playlist', latestVersion[data.id]);
        socket.emit('playlistChange', latestVersion[data.id]);

      }

    });

  });
};

module.exports = socketServer;
