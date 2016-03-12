'use strict';

let TypedError = require('error/typed');


let ClientError = TypedError({
  type: 'client.4xx',
  message: '{title} status={statusCode}',
  title: null,
  statusCode: null,
});
exports.ClientError = ClientError;


let Invalid = TypedError({
  type: 'invalid',
  message: 'Invalid {field} value {value}: {error}',
  field: null,
  value: null,
  error: null,
});
exports.Invalid = Invalid;
