'use strict';


const moduleDocsModel = require('./moduleDocsModel.schema');

exports.handler = async(event)=>{

  const id = event.pathParamters.id;

  try{
    let data;

    if(id){
      data = await moduleDocsModel.query('id').eq(id).limit(1).exec();

    }else{
      data = await moduleDocsModel.scan().exec();
    }
    return{
      statusCode: 200,
      body: JSON.stringify(data)
    }

  }catch(e){
    return{
      statusCode: 500,
      response: e.message
    }
  }
}
