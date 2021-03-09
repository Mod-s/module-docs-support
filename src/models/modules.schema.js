'use strict';

const mongoose = require('mongoose');

const moduleDocsSchema = new mongoose.Schema({
  "name": String,
  "mainUrl": String,
  "multipleUrl": {
    "type": Array,
    "schema": [String]
  },
  "description": String,
  "protect": Boolean
});

module.exports = mongoose.model('mods', moduleDocsSchema); //mods is the name of the local mongoDB