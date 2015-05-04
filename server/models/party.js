
var baseModel = require('./baseModel');

var Party = Object.create(baseModel);

Party.setup = function(db){
  Party.init(db, 'activeIps');
  Party.reset();
};

  // extends
Party.connectClient = function(ip, plId, fn){
  Party.updateOrInsert(
    {ip: ip, playlistId: plId},
    {
      $inc: {clients: 1}
    },
    function(err, result){
      console.log('(m) party.js: registred ip ', ip, 'to', plId);
      fn(result);
    }
  );
};

Party.disconnectClient = function(ip, plId, fn){
  Party.find({ip: ip, playlistId: plId}, function(err, result){
    console.log(result);
    if(!result || !result.length) return;

    if(result[0].clients === 1){
      Party.delete({ip: ip, playlistId: plId}, function(err, result){
        if(fn){ fn(); }
      });
      console.log('(m) party.js: delete ', {ip: ip, playlistId: plId});
    } else {
      Party.update(
        {ip: ip, playlistId: plId},
        {$inc: {clients: -1}},
        function(err, res){
          console.log('(m) party.js: api disconnect, clients on', plId);
          if(fn){
            fn(res);
          }
        }
      );
    }
  });
};

Party.reset = function(){
  Party.delete({}, function(err, result){});
};


module.exports = Party;
