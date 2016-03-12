'use strict';

let expressPromiseRouter = require('express-promise-router');
let bodyParser = require('body-parser');

let pasteModel = require('./models/paste.js');
let ClientError = require('./errors.js').ClientError;


let rootRouter = expressPromiseRouter();
let apiRouter = expressPromiseRouter();

rootRouter.use('/api', apiRouter);
rootRouter.use(bodyParser.urlencoded({extended: true}));
apiRouter.use(bodyParser.json());


rootRouter.get('/', function(request, response) {
  response.render('pasteform');
});

rootRouter.get('/paste/:id', function(request, response) {
  return request.db.paste.fetchById(request.params.id).then(function(paste) {
    if (paste === null) {
      throw ClientError({
        title: 'could not find paste with ID ' + request.params.id,
        statusCode: 404,
      });
    } else {
      // TODO: replace this with a real template
      let body = `<h1>${paste.name}</h1><pre>${paste.content}</pre>\r\n`;
      response.send(body);
    }
  });
});



apiRouter.get('/pastes/:id', function(request, response) {
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

apiRouter.post('/pastes', function(request, response) {
  return request.db.paste.insertNew(request.body).then(function(pasteId) {
    response.status(201).json({id: pasteId});
  });
});

module.exports = rootRouter;
