'use strict';

const uuid = require('uuid').v4;
const moduleDocsModel = require('../models/modules.schema.js');


//TODO: Refactor event to req, res
//TODO: Refactor response

createHandler = async (event) => { 

console.log('CREATE createHandler event ', event);

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

module.exports = createHandler;