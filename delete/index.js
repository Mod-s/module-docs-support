'use strict';


const { update } = require('./moduleDocsModel.schema');
const moduleDocsModel = require('./moduleDocsModel.schema');

exports.handler = async(event)=>{

  const id = event.pathParameters.id; //capture record id from the user
  const urlToDelete = JSON.parse(event.body.index); //capture the index position of the user-generated url to delete

  console.log('__URL To Delete From User__: ', urlToDelete);

  try{
    let data;

    data = await moduleDocsModel.query('id').eq(id).limit(1).exec();

    console.log('__Existing Record__: ', data);

    let name = data.name;
    let mainUrl = data.mainUrl;
    let multipleUrl = data.multipleUrl.splice(urlToDelete, 1);
    let description = data.description;

    const updatedData = await moduleDocsModel.update({id, name, mainUrl, multipleUrl, description});

    console.log('__Updated Record__: ', update);

    return{
      statusCode: 200,
      body: JSON.stringify(updatedData)
    }

  }catch(e){
    return{
      statusCode: 500,
      response: e.message
    }
  }
}
