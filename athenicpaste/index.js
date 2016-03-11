'use strict';

let express = require('express');

let router = require('./router.js');
let createDatabaseManager = require('./models').createDatabaseManager;
let ClientError = require('./errors.js').ClientError;


function createApplication(config) {
  return createDatabaseManager(config.dbUrl).then(function(dbManager) {
    let app = express();

    app.use(function(request, response, next) {
      request.db = dbManager;
      next();
    });

    app.use(router);

    app.use(function handleClientError(err, request, response, next) {
      if (err instanceof ClientError) {
        response.status(err.statusCode).send(err.message);
      } else {
        next(err);
      }
    });

    app.use(function logErrors(err, request, response, next) {
      console.error(err.stack);
      //next(err);
    });

    return app;
  });
}

module.exports = createApplication;
