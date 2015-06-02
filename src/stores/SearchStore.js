
var Constants = require('../constants/AppConstants');
var CHANGE_EVENT = Constants.CHANGE_EVENT;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var objectAssign = require('object-assign');

var _videos = [];
var _q;
var _recent = window.DATA.recent;

function searchReturned(terms){
  _videos = _videos.concat(terms).sort(function(a, b){
    if(a.source === 'youtube' && b.source !== 'youtube')
      return -1;
    return 0;
  });
}

function resetSearch(){
  _videos = [];
}


function setQuery(q){
  _q = q;
}

function setRecentTerms(t){
  _recent = t;
}

var SearchStore = objectAssign(EventEmitter.prototype, {

  getVideos: function(){
    return _videos;
  },

  getRecentTerms: function(){
    return _recent;
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
    case Constants.EMPTY_RESULTS_PARTIAL:
      resetSearch();
    break;
    case Constants.RESET_RESULTS:
      resetSearch();
      setQuery('');
      SearchStore.emitChange();
    break;
    case Constants.RECENT_TERMS:
      setRecentTerms(action.response.terms);
      SearchStore.emitChange();
    break;

  }
});


module.exports = SearchStore;