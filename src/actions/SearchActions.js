var Api = require('../utils/Api');
var Constants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var fbPageReg = /.*facebook.com\/(.*)\/?/,
    urlReg = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;

var SearchActions = {
  search: function(q, videoDef){
    AppDispatcher.handleViewAction({
      actionType: Constants.QUERY,
      response: {
        query: q
      }
    });

    var decodedQ = decodeURIComponent(q);
    console.log('searchactions', q)

    var id;
    if((id = decodedQ.match(fbPageReg))) {

      if(id[1].indexOf('pages') === 0){
        // got more work to do
        id = id[1].match(/pages\/.*\/(.*)\/?/);
      }

      // getting videos from a facebook page
      Api.getFacebookPageVideos(id[1]);

    } else if(decodedQ.match(urlReg)){
      Api.getVideosFromUrl(decodedQ);

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
