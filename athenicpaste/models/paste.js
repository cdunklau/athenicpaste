'use strict';

let validators = require('../validators.js');
let createManagerFactory = require('./baseModelManager.js');


let createManager = createManagerFactory({
  collectionName: 'pastes',

  validation: {
    name: validators.isString,
    content: validators.isString,
  },
});

exports.createManager = createManager;
