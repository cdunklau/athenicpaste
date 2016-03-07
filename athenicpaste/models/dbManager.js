'use strict';

let mongodb = require('mongodb');

let paste = require('./paste.js');

// Return a Promise that resolves to the model controller
function createDatabaseManager(dbUrl) {
  return mongodb.MongoClient.connect(dbUrl).then(function(db) {
    return {
      paste: paste.createManager(db),
    };
  });
}

module.exports = createDatabaseManager;
