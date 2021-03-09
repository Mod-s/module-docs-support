'use strict';


const moduleDocsModel = require('../models/modules.schema.js');

//TODO: refactor to use req/res
//TODO: refactor responses

const updateHandler = async (event) => {

console.log('UPDATE updateHandler event ', event);

  // console.log('1.__EVENT__PUT:', event);
  let { updateUrl } = JSON.parse(event.body);

  //const updateMultipleUrl = JSON.parse(event.body.multipleUrl);

  const id = event.pathParameters.id

  // console.log('2__Updated updateUrl From User__: ', updateUrl);
  //new urls that were sent with put request (updateUrl) [ 'www.here9000.com', 'www.backagain.com' ]
  try {
    let data;

    data = await moduleDocsModel.query('id').eq(id).limit(1).exec();


    // console.log('A.____ Data at 0: ', data[0]);
    //document object {}

    // console.log('B.____ Data[0].multipleUrl: ', data[0].multipleUrl);
    //original url's to be updated [ 'www.here1.com', 'www.here2.com' ]

    let name = data[0].name;
    let mainUrl = data[0].mainUrl;
    // console.log('mainUrl after query:', mainUrl)
    // let multipleUrl = data[0].multipleUrl.push(updateUrl); //
    let multipleUrl = data[0].multipleUrl.concat(updateUrl);
    // let multipleUrl = updateUrl;
    // console.log('C.____ this is a test of the emergency broadcast system...this is only a test');
    let description = data[0].description;
    let protect = data[0].protect;

    // console.log('D.____ multipleUrl updated: ', multipleUrl);

    const updatedData = await moduleDocsModel.update({ id, name, mainUrl, multipleUrl, description, protect });

    // console.log('3.__Updated Record__: ', updatedData);

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

module.exports = updateHandler;