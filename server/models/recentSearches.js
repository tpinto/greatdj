
var recentSearches = [];

var RecentSearches = {
  insert: function(term){
    if(recentSearches.indexOf(term) !== -1){ //exists
      recentSearches.splice(recentSearches.indexOf(term), 1);
      recentSearches.push(term);
    } else {
      recentSearches.push(term);
      if(recentSearches.length > 10) recentSearches.shift();
    }
  },

  getAll: function(){
    return recentSearches;
  }

};

module.exports = RecentSearches;