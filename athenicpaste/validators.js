'use strict';

let Invalid = require('./errors.js').Invalid;


function isString(value, field) {
  if (typeof value === 'string' || value instanceof String) {
    return true;
  }
  throw Invalid({
    value: value,
    field: field,
    error: 'expected string, not ' + typeof value,
  });
}
exports.isString = isString;
