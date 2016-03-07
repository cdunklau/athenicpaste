'use strict';

let expressPromiseRouter = require('express-promise-router');

let pasteModel = require('./models/paste.js');
let ClientError = require('./errors.js').ClientError;


let router = expressPromiseRouter();


router.get('/', function(request, response) {
  response.render('pasteform');
});

router.get('/paste/:id', function(request, response) {
  return request.db.paste.fetchById(request.params.id).then(function(paste) {
    if (paste === undefined) {
      throw ClientError({
        title: 'could not find paste with ID ' + request.params.id,
        statusCode: 404,
      });
    } else {
      response.render('paste-display', {paste: paste});
    }
  });
});

router.get('/api/pastes', function(request, response) {
  return request.db.then(function(db) {
    return db.collection('pastes').find({}).toArray();
  }).then(function(results) {
    response.json(results);
  });
});


router.get('/api/pastes/:id', function(request, response) {
  return request.db.paste.fetchById(request.params.id).then(function(paste) {
    if (paste === null) {
      throw ClientError({
        title: 'could not find paste with ID ' + request.params.id,
        statusCode: 404,
      });
    } else {
      response.json(paste);
    }
  });
});

module.exports = router;
