'use strict';


const moduleDocsModel = require('./moduleDocsModel.schema');

exports.handler = async (event) => {
  console.log('__EVENT__PUT:', event);
  const { updatedMultipleUrl } = JSON.parse(event.body);

  const id = event.pathParameters.id

  console.log('__Updated MultipleURL From User__: ', updatedMultipleUrl);

  try {
    let data;

    data = await moduleDocsModel.query('id').eq(id).limit(1).exec();

    console.log('__Existing Record__: ', data);

    let name = data.name;
    let mainUrl = data.mainUrl;
    let multipleUrl = data.multipleUrl.push(updatedMultipleUrl);
    let description = data.description;
    let protect = data.protect;

    const updatedData = await moduleDocsModel.update({ id, name, mainUrl, multipleUrl, description, protect });

    console.log('__Updated Record__: ', update);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedData)
    }

  } catch (e) {
    return {
      statusCode: 500,
      response: e.message
    }
  }
}
