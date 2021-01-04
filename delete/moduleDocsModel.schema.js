'use strict';

const dynamoose = require('dynamoose');

const moduleDocsSchema = new dynamoose.Schema({
  "id": String,
  "name": String,
  "mainUrl": String,
  "multipleUrl": {
    "type": Array,
    "schema": [String]
  },
  "description": String,
  "protected": Boolean
});

module.exports = dynamoose.model('moduleDocs', moduleDocsSchema);