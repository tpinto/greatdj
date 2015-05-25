
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
        // there are clients and a current playlist version, return those
        latestVersion[data.id].deltats = new Date().getTime() - latestVersion[data.id].ts;
        socket.emit('playlistChange', latestVersion[data.id]);

      } else {
        // client is creating the party
        data.ts = new Date().getTime();
        data.deltats = 0;

        // if data.playlist doesnt exists he is joining a party that ended in the meantime.
        // get the playlist from the server before returning the data
        if(!data.playlist){
          Playlist.getPlaylistById(data.id, function(err, result){
            data.playlist = result.playlist || [];
            data.position = 0;
            socket.emit('playlistChange', data);
            latestVersion[plId] = data;
          })
        } else {
          socket.emit('playlistChange', data);
          latestVersion[plId] = data;
        }
      }

      socket.join(data.id);

      myIp = socket.request.connection.remoteAddress;
      Parties.connectClient(socket.request.connection.remoteAddress, data.id, function(result){
        io.to(data.id).emit('presence', {clients: playlistClients[data.id].length})
      });

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

        var numClients = playlistClients[plId].length;
        var playlistId = plId;

        Parties.disconnectClient(myIp, plId, function(result){
          console.log('presence on disconnect:', numClients);
          io.to(playlistId).emit('presence', {clients: numClients})
        });
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

        socket.leave(plId);

        var numClients = playlistClients[plId].length;
        var playlistId = plId;

        Parties.disconnectClient(myIp, plId, function(result){
          console.log('presence on disconnect:', numClients)
          io.to(playlistId).emit('presence', {clients: numClients})
        });
        plId = null;

      }
    });

    socket.on('changedPlaylist', function(data){
      console.log(' * changedPlaylist:', data.id);

      if(!latestVersion[data.id] ||
        (latestVersion[data.id] && latestVersion[data.id].ts === data.ts)){

        data.ts = new Date().getTime();
        data.deltats = 0;

        latestVersion[data.id] = data;

        io.to(data.id).emit('playlistChange', data);
      } else {
        // client based on an old version of the pl, gonna send the actual one for now
        // would be nice to have some sort of diff here...
        console.log('* Getting client up to date with playlist', latestVersion[data.id]);

        latestVersion[data.id].deltats = new Date().getTime() - latestVersion[data.id].ts;
        socket.emit('playlistChange', latestVersion[data.id]);

      }

    });

  });
};

module.exports = socketServer;
