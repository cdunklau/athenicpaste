let express = require('express');


function createApp() {
  let app = express();

  app.get('/', function(req, res) {
    res.send('Hello world!');
  });

  return app;
}

exports.createApp = createApp;
