
var Constants = require('../constants/AppConstants');
var CHANGE_EVENT = Constants.CHANGE_EVENT;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');


var _videos = [];
var _q;

function searchReturned(terms){
  _videos = terms;
}

function setQuery(q){
  _q = q;
}

var SearchStore = merge(EventEmitter.prototype, {

  getVideos: function(){
    return _videos;
  },

  getRecentTerms: function(){
    return window.recent;
  },

  getCurrentQuery: function(){
    return _q;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case Constants.QUERY:
      setQuery(action.response.query);
      SearchStore.emitChange();
    break;
    case Constants.SEARCH_SUCCESS:
      searchReturned(action.response.items);
      SearchStore.emitChange();
    break;
    case Constants.RESET_RESULTS:
      searchReturned([]);
      SearchStore.emitChange();
    break;

  }
});


module.exports = SearchStore;