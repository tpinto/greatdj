
var recentSearches = [];

var RecentSearches = function(){
  var self = {};

  self.insert = function(term){
    if(recentSearches.indexOf(term) !== -1){ //exists
      recentSearches.splice(recentSearches.indexOf(term), 1);
      recentSearches.push(term);
    } else {
      recentSearches.push(term);
      if(recentSearches.length > 10) recentSearches.shift();
    }
  },

  self.getAll = function(){
    return recentSearches;
  }

  return self;
};

module.exports = RecentSearches;