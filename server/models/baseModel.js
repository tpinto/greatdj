
var BaseModel = function(db, model){
  var api = {};

  api.getAll = function(callback){
    db.collection(model).find().toArray(callback);
  };

  api.find = function(query, callback){
    db.collection(model).find(query).toArray(callback);
  };

  api.insert = function(obj, callback, opts){
    opts = opts || {w: 1};
    db.collection(model).insert(obj, opts, callback);
  };

  api.update = function(query, update, callback, opts){
    opts = opts || {w: 1};
    db.collection(model).insert(query, update, opts, callback);
  };

  api.updateOrInsert = function(query, update, callback){
    db.collection(model).insert(query, update, {w:1, upsert: true}, callback);
  };

  api.delete = function(obj, callback){
    db.collection(model).remove(obj, callback);
  };

  return api;

};

module.exports = BaseModel;