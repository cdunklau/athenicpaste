'use strict';

let TypedError = require('error/typed');


let ClientError = TypedError({
  type: 'client.4xx',
  message: '{title} status={statusCode}',
  title: null,
  statusCode: null,
});
exports.ClientError = ClientError;
