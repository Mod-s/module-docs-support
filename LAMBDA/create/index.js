'use strict';

const uuid = require('uuid').v4;
const moduleDocsModel = require('./moduleDocsModel.schema.js');
const { DocumentClient } = require('aws-sdk/clients/dynamodb');


// exports.handler = async (event) => {

exports.handler = async (event) => {

  const { name, mainUrl, multipleUrl, description, protect } = JSON.parse(event.body);


  if (protect === null) (protect = false);

  const id = uuid();

  try {
    const record = new moduleDocsModel({ id, name, mainUrl, multipleUrl, description, protect });
    const data = await record.save();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (e) {
    return {
      statusCode: 500,
      response: e.message
    }
  }
};

