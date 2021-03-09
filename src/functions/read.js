'use strict';


const moduleDocsModel = require('../models/modules.schema.js');

//TODO: refactor for req/res
//TODO: refactor responses

readHandler = async (event) => {

console.log('READ readHandler event ', event);

  let id;
  if (event.pathParameters) {


    id = event.pathParameters.id;
  };

  try {
    let data;

    if (id) {
      data = await moduleDocsModel.query('id').eq(id).limit(1).exec();

    } else {
      data = await moduleDocsModel.scan().exec();
    }
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
}

module.exports = readHandler;