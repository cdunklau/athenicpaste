'use strict';

let express = require('express');

let router = require('./router.js');
let createDatabaseManager = require('./models').createDatabaseManager;
let ClientError = require('./errors.js').ClientError;


function createApplication(config, dbManager) {
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

  return app;
}
exports.createApplication = createApplication;


/**
 * Return a Promise that resolves with a listening http.Server.
 */
function startServer(config) {
  return createDatabaseManager(config.dbUrl).then(function(dbManager) {
    return createApplication(config, dbManager);
  }).then(function(application) {
    return application.listen(config.port);
  }).catch(function(err) {
    console.log('Failed to set up listener %s', err);
    throw err;
  });
}
exports.startServer = startServer;
