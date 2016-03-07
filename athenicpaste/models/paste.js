'use strict';

let ObjectID = require('mongodb').ObjectID;


function createManager(db) {
  return {
    db: db,

    getCollection: function() {
      return this.db.collection('pastes');
    },

    fetchById: function(stringId) {
      return this.getCollection().find({
        _id: new ObjectID(stringId),
      }).limit(1).next();
    },
  };
}


exports.createManager = createManager;
