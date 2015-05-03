
var baseModel = require('./baseModel');

var Party = Object.create(baseModel);

Party.setup = function(db){
  Party.init(db, 'activeIps');
  Party.reset();
};

  // extends
Party.connectClient = function(ip, plId){
  Party.updateOrInsert(
    {ip: ip},
    {
      $set: {playlistId: plId},
      $inc: {clients: 1}
    },
    function(err, result){
      console.log('(m) party.js: registred ip ', ip, 'to', plId);
    }
  );
};

Party.disconnectClient = function(ip, plId){
  Party.find({ip: ip, playlistId: plId}, function(err, result){
    console.log(result[0]);
    if(result[0].clients === 1){
      Party.delete({ip: ip, playlistId: plId});
      console.log('(m) party.js: delete ', {ip: ip, playlistId: plId});
    } else {
      Party.update(
        {ip: ip, playlistId: plId},
        {$inc: {clients: -1}},
        function(err, res){
          console.log('(m) party.js: api disconnect, clients on', plId);
        }
      );
    }
  });
};

Party.reset = function(){
  Party.delete({});
};


module.exports = Party;
