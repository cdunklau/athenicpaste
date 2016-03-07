'use strict';

let express = require('express');

let router = require('./router.js');
let createDatabaseManager = require('./models/dbManager.js');
let ClientError = require('./errors.js').ClientError;


const dbUrl = 'mongodb://localhost:27017/athenicpaste';


function logErrors(err, request, response, next) {
  console.error(err.stack);
  next();
}


function handleClientError(err, request, response, next) {
  if (err instanceof ClientError) {
    response.status(err.statusCode).send(err.message);
  } else {
    next();
  }
}


function createApplication() {
  return createDatabaseManager(dbUrl).then(function(dbManager) {
    let app = express();

    app.use(function(request, response, next) {
      request.db = dbManager;
      next();
    });

    app.use(router);

    app.use(logErrors);
    app.use(handleClientError);
    return app;
  });
}

exports.createApplication = createApplication;
