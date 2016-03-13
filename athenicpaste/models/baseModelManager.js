'use strict';

let BPromise = require('bluebird');
let ObjectID = require('mongodb').ObjectID;
let _ = require('lodash');
let joi = require('joi');

joi.validateAsync = BPromise.promisify(joi.validate);


let managerMethods = {
  getCollection: function() {
    return this.db.collection(this.collectionName);
  },

  fetchById: function(stringId) {
    let self = this;

    let resultBPromise = this.getCollection().find({
      _id: ObjectID.createFromHexString(stringId),
    }).limit(1).next();
    return resultBPromise.then(function(modelInstance) {
      if (modelInstance === null) {
        return null;
      }
      return modelInstance;
    });
  },

  insertNew: function(modelInstance) {
    let self = this;

    return self.validateInstance(modelInstance).then(
            function doInsert(validatedModelInstance) {
      return self.getCollection().insertOne(validatedModelInstance);
    }).then(function getInsertedIdString(insertResult) {
      return insertResult.insertedId.toHexString();
    });
  },

  validateInstance: function(modelInstance) {
    return joi.validateAsync(modelInstance, this.schema);
  },
};


/**
 * Return a function that accepts a MongoDB "db" instance and returns a
 * model manager.
 *
 * @param {Object} properties
 * - The properties of the model manager. There are two required properties.
 * @param {string} properties.collectionName
 * - The MongoDB collection where these models will be stored.
 * @param {Object} properties.schema
 * - A Joi schema for validating the model fields.
 *
 */
function createManagerFactory(properties) {
  ['collectionName', 'schema'].forEach(function(requiredField) {
    if (!_.has(properties, requiredField)) {
      throw new TypeError(
        `properties.${requiredField} not provided but is required`
      );
    }
  });

  return function createManager(db) {
    return Object.assign({}, managerMethods, properties, {db: db});
  };
}


module.exports = createManagerFactory;
