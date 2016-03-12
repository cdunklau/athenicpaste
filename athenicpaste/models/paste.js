'use strict';

let joi = require('joi');

let createManagerFactory = require('./baseModelManager.js');


let pasteSchema = joi.object().keys({
  name: joi.string().min(1).max(200),
  content: joi.string().min(1).max(1e6),
}).requiredKeys(['name', 'content']);


let createManager = createManagerFactory({
  collectionName: 'pastes',
  schema: pasteSchema,
});

exports.createManager = createManager;
