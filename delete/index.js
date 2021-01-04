'use strict';


const { update } = require('./moduleDocsModel.schema');
const moduleDocsModel = require('./moduleDocsModel.schema');

exports.handler = async(event)=>{

  const id = event.pathParameters.id; //capture record id from the user
  const deleteRecord = JSON.parse(event.body.deleteRecord); //user input requesting to delete record (users sends 1 to delete whole record or 0 to delete only a user url)

  if (deleteRecord === 0){ //check to see if the user is trying to remove a user-created url
    const urlToDelete = JSON.parse(event.body.index); //capture the index position of the user-generated url to delete
    console.log('__URL Index To Delete From User__: ', urlToDelete);
  }

  try{
    let data;

    data = await moduleDocsModel.query('id').eq(id).limit(1).exec(); //check DB for existing record
    let protected = data.protected; //set temp variable to hold the protected status of the record

    console.log('__Existing Record__: ', data);

    if(deleteRecord === 1 && protected === false){ //check if user wants to delete the whole record and the record is not protected
      await moduleDocsModel.delete(id); //delete the whole record
      return{
        statusCode: 200,
        body: 'Record deleted successfully.' //return an empty object
      }
    } 
    
    if (deleteRecord === 1 && protected === true){ //check to see if user wants to delete the entire record and if it is protected
      return{
        statusCode: 200,
        body: 'This record is protected. User may only delete user created content. If you would like to delete a user created URL, please try again, but do not attempt to delete the entire record.' //return a message indicating that deletion of a protected record is not allowed
      }
    }

    if(deleteRecord === 0){
      let name = data.name; //set temp variables to hold existing data
      let mainUrl = data.mainUrl;
      let multipleUrl = data.multipleUrl.splice(urlToDelete, 1); //updated the user-created url array, remove the selected index position
      let description = data.description;
      

      const updatedData = await moduleDocsModel.update({id, name, mainUrl, multipleUrl, description}); //update the record - only update should be in the multipleUrl
  
      console.log('__Updated Record__: ', update);
  
      return{
        statusCode: 200,
        body: JSON.stringify(updatedData) //return updated record
      }
    }

  }catch(e){
    return{
      statusCode: 500,
      response: e.message
    }
  }
}
