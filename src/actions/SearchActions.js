var Api = require('../utils/Api');
var Constants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var fbPageReg = /.*facebook.com\/(.*)\/?/,
    urlReg = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

var SearchActions = {
  search: function(q, videoDef){
    AppDispatcher.handleViewAction({
      actionType: Constants.QUERY,
      response: {
        query: q
      }
    });

    var id;
    if((id = q.match(fbPageReg))) {

      if(id[1].indexOf('pages') === 0){
        // got more work to do
        id = id[1].match(/pages\/.*\/(.*)\/?/);
      }

      // getting videos from a facebook page
      Api.getFacebookPageVideos(id[1]);

    } else if(q.match(urlReg)){
      Api.getVideosFromUrl(q);

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
