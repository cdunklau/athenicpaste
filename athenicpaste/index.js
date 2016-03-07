'use strict';

let express = require('express');

let router = require('./router.js');
let createDatabaseManager = require('./models/dbManager.js');
let ClientError = require('./errors.js').ClientError;


const dbUrl = 'mongodb://localhost:27017/athenicpaste';


function createApplication() {
  return createDatabaseManager(dbUrl).then(function(dbManager) {
    let app = express();

    app.use(function(request, response, next) {
      request.db = dbManager;
      next();
    });

    app.use(router);

    app.use(function logErrors(err, request, response, next) {
      console.error(err.stack);
      next(err);
    });
    app.use(function handleClientError(err, request, response, next) {
      if (err instanceof ClientError) {
        response.status(err.statusCode).send(err.message);
      } else {
        next(err);
      }
    });
    return app;
  });
}

module.exports = createApplication;
