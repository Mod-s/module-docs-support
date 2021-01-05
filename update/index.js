'use strict';


const moduleDocsModel = require('./moduleDocsModel.schema');

exports.handler = async (event) => {
  console.log('1.__EVENT__PUT:', event);
  let { multipleUrl } = JSON.parse(event.body);

  //const updateMultipleUrl = JSON.parse(event.body.multipleUrl);

  const id = event.pathParameters.id

  console.log('2__Updated MultipleURL From User__: ', multipleUrl);

  try {
    let data;

    data = await moduleDocsModel.query('id').eq(id).limit(1).exec();

    console.log('3.__Existing Record__: ', data);

    let name = data.Document.name;
    let mainUrl = data.Document.mainUrl;
    multipleUrl = data.Document.multipleUrl.push(multipleUrl);
    let description = data.Document.description;
    let protect = data.Document.protect;

    const updatedData = await moduleDocsModel.update({ id, name, mainUrl, multipleUrl, description, protect });

    console.log('4.__Updated Record__: ', updateData);

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
