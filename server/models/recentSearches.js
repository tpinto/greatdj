
var recentSearches = [
  'boy george do you really want to hurt me',
  'Herbie Hancock',
  'bbc radio 1',
  'greg wilson',
  'ag cook',
  'nicki minaj',
  'fall out boy',
  'beyonce',
  'client liaison',
  'Retiree'];

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