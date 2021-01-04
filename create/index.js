'use strict';

const uuid = require('uuid').v4;
const moduleDocsModel = require('./module.doc.schema.js');


exports.handler = async (event) => {
  const { name, mainUrl, multipleUrl, description } = JSON.parse(event.body);

  const id = uuid();

  try {
    const record = new moduleDocsModel({ id, name, mainUrl, multipleUrl, description });
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