var Api = require('../utils/Api');
var Constants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var SearchActions = {
  search: function(q, videoDef){
    AppDispatcher.handleViewAction({
      actionType: Constants.QUERY,
      response: {
        query: q
      }
    });

    var id;
    if((id = q.match(/.*facebook.com\/(.*)\/?/))) {
      // getting videos from a facebook page
      Api.getFacebookPageVideos(id[1]);
    } else {
      // good old youtube search
      Api.searchForVideos(q, videoDef);
    }
  },

  resetResults: function(){
    AppDispatcher.handleViewAction({
      actionType: Constants.RESET_RESULTS,
    });

    Api.getRecentTerms();

  },
};

module.exports = SearchActions;
