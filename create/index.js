'use strict';

const uuid = require('uuid').v4;
const moduleDocsModel = require('./moduleDocsModel.schema.js');


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

const ddb = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local",
});