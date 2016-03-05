'use strict';

let express = require('express');


function createApplication() {
  let app = express();

  app.get('/', function(req, res) {
    res.send('Hello world!');
  });

  return app;
}

exports.createApplication = createApplication;
