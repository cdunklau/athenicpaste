'use strict';

let ObjectID = require('mongodb').ObjectID;
let _ = require('lodash');

let validators = require('../validators.js');


function createManager(db) {
  return {
    db: db,
    fields: {
      name: validators.isString,
      content: validators.isString,
    },

    getCollection: function() {
      return this.db.collection('pastes');
    },

    fetchById: function(stringId) {
      let self = this;
      let resultPromise = this.getCollection().find({
        _id: ObjectID.createFromHexString(stringId),
      }).limit(1).next();
      return resultPromise.then(function(pasteInstance) {
        if (pasteInstance === null) {
          return null;
        }
        return self.cleanedFields(pasteInstance);
      });
    },

    insertNew: function(pasteInstance) {
      let self = this;

      return Promise.resolve(pasteInstance).then(function(pasteInstance) {
        return self.validatedFields(self.cleanedFields(pasteInstance));
      }).then(function doInsert(validatedPasteInstance) {
        return self.getCollection().insertOne(validatedPasteInstance);
      }).then(function getInsertedIdString(insertResult) {
        return insertResult.insertedId.toHexString();
      });
    },

    cleanedFields: function(pasteInstance) {
      let result = {};
      _.forOwn(this.fields, function(ignored, field) {
        if (_.has(pasteInstance, field)) {
          result[field] = pasteInstance[field];
        }
      });

      return result;
    },

    validatedFields: function(pasteInstance) {
      let result = {};
      _.forOwn(this.fields, function(isValid, field) {
        let value = pasteInstance[field];
        if (isValid(value, field)) {
          result[field] = value;
        }
      });
      return result;
    },

  };
}


exports.createManager = createManager;
