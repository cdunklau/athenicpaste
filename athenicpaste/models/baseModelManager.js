'use strict';

let ObjectID = require('mongodb').ObjectID;
let _ = require('lodash');


let managerMethods = {
  getCollection: function() {
    return this.db.collection(this.collectionName);
  },

  fetchById: function(stringId) {
    let self = this;

    let resultPromise = this.getCollection().find({
      _id: ObjectID.createFromHexString(stringId),
    }).limit(1).next();
    return resultPromise.then(function(modelInstance) {
      if (modelInstance === null) {
        return null;
      }
      return self.cleanedFields(modelInstance);
    });
  },

  insertNew: function(modelInstance) {
    let self = this;

    return Promise.resolve(modelInstance).then(function(modelInstance) {
      return self.validatedFields(self.cleanedFields(modelInstance));
    }).then(function doInsert(validatedPasteInstance) {
      return self.getCollection().insertOne(validatedPasteInstance);
    }).then(function getInsertedIdString(insertResult) {
      return insertResult.insertedId.toHexString();
    });
  },

  cleanedFields: function(modelInstance) {
    let result = {};
    _.forOwn(this.validation, function(ignored, field) {
      if (_.has(modelInstance, field)) {
        result[field] = modelInstance[field];
      }
    });
    return result;
  },

  validatedFields: function(modelInstance) {
    let result = {};
    _.forOwn(this.validation, function(isValid, field) {
      let value = modelInstance[field];
      if (isValid(value, field)) {
        result[field] = value;
      }
    });
    return result;
  },
};


function createManagerFactory(properties) {
  ['collectionName', 'validation'].forEach(function(requiredField) {
    if (!_.has(properties, requiredField)) {
      throw new TypeError('properties.' + requiredField + ' is required');
    }
  });

  return function createManager(db) {
    return Object.assign({}, managerMethods, properties, {db: db});
  };
}


module.exports = createManagerFactory;
