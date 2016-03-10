'use strict';

let mongodb = require('mongodb');

let paste = require('./paste.js');


/**
 * Return a Promise that resolves to the model controller
 *
 * @param {string} dbUrl - The URL for the MongoDB connection.
 */
function createDatabaseManager(dbUrl) {
  return mongodb.MongoClient.connect(dbUrl).then(function(db) {
    return {
      paste: paste.createManager(db),
    };
  });
}

exports.createDatabaseManager = createDatabaseManager;
