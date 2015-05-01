
var baseModel = require('./baseModel');

var Party = function(db){
  var self = baseModel(db, 'activeIps');

  // extends
  self.connectClient = function(ip, plId){
    self.updateOrInsert(
      {ip: ip},
      {
        $set: {playlistId: plId},
        $inc: {clients: 1}
      },
      function(err, result){
        console.log('registred ip ', ip, 'to', plId);
      }
    );
  };

  self.disconnectClient = function(ip, plId){
    self.find({ip: ip, playlistId: plId}, function(err, result){
      if(result.clients === 1){
        self.delete({ip: ip, plId: plId});
      } else {
        self.update(
          {ip: ip, playlistId: plId},
          {$dec: {clients: 1}},
          function(err, result){
            console.log('api disconnect, clients on', plId, 'now', clients-1);
          }
        );
      }
    });
  }

  return self;
}

module.exports = Party;
