
var RecentSearches = require('../models/recentSearches')();

/**
  Controller that saves and returns the current searches

**/

var SearchController = function(db){
  var api = {};

  api.newSearch = function(req, res){
    if(req.body.term){
      RecentSearches.insert(req.body.term);
      res.send({ok: 'ok'});
    } else {
      res.send({error: 'no term?'});
    }
  };

  api.getSearches = function(req, res){
    res.send({terms: RecentSearches.getAll()});
  };

  return api;
};

module.exports =  SearchController;