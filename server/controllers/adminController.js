
var credentials = require('../auth.json');

// Parties model
var Parties = require('../models/party');

/**
  Controller for serving the Admin section

**/

var AdminController = function(db){
  var api = {};
  Parties.setup(db);

  api.index = function(req, res){
    var user = auth(req);

    if(!user || !(user.name === credentials.username && user.pass === credentials.password)){
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
      res.end('Unauthorized');
    } else {
      Parties.getAll(function(result){
        result.map(function(party){
          party.numClients = activeIpsController.getClientsByIp[party.ip];
          return party;
        });
        res.render('admin', {activeIps: result});
      });
    }
  };

  return api;
};

module.exports = AdminController;