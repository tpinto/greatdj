
var BaseModel = {
  init: function(db, model){
    this.db = db;
    this.model = model;
  },

  getAll: function(callback){
    this.db.collection(this.model).find().toArray(callback);
  },

  find: function(query, callback){
    this.db.collection(this.model).find(query).toArray(callback);
  },

  insert: function(obj, callback, opts){
    opts = opts || {w: 1};
    callback = callback || function(){};
    this.db.collection(this.model).insert(obj, opts, callback);
  },

  update: function(query, update, callback, opts){
    opts = opts || {w: 1};
    callback = callback || function(){};
    this.db.collection(this.model).update(query, update, opts, callback);
  },

  updateOrInsert: function(query, update, callback){
    callback = callback || function(){};
    this.db.collection(this.model).update(query, update, {w:1, upsert: true}, callback);
  },

  delete: function(obj, callback){
    callback = callback || function(){};
    this.db.collection(this.model).remove(obj, callback);
  },
};

module.exports = BaseModel;