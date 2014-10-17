var Api = require('../utils/Api');
var Constants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var SearchActions = {
  search: function(q, videoDef){
    // AppDispatcher.handleViewAction({
    //   actionType: Constants.QUERY,
    //   response: {
    //     query: q,
    //     videoDef: videoDef
    //   }
    // });

    Api.searchForVideos(q, videoDef);
  },

  resetResults: function(){
    AppDispatcher.handleViewAction({
      actionType: Constants.RESET_RESULTS,
    });
  },
};

module.exports = SearchActions;
