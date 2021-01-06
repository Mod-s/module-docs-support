'use strict';



const moduleDocsModel = require('./moduleDocsModel.schema');

// exports.handler = async (event) => {

exports.handler = async (event) => {

  console.log('1.__EVENT__PUT:', event);

  const id = event.pathParameters.id; //capture record id from the user
  const { deleteRecord } = JSON.parse(event.body); //user input requesting to delete record (users sends 1 to delete whole record or 0 to delete only a user url)

  // if (deleteRecord === 0) { //check to see if the user is trying to remove a user-created url
  const { urlToDelete } = JSON.parse(event.body); //capture the index position of the user-generated url to delete
  console.log('__URL Index To Delete From User__: ', urlToDelete);
  // }

  try {
    let data;

    data = await moduleDocsModel.query('id').eq(id).limit(1).exec(); //check DB for existing record
    let protect = data[0].protect; //set temp variable to hold the protect status of the record

    console.log('__Existing Record__: ', data[0]);

    if (deleteRecord === 1 && protect === false) { //check if user wants to delete the whole record and the record is not protect
      await moduleDocsModel.delete(id); //delete the whole record
      return {
        statusCode: 200,
        body: 'Record deleted successfully.' //return an empty object
      }
    }

    if (deleteRecord === 1 && protect === true) { //check to see if user wants to delete the entire record and if it is protect
      return {
        statusCode: 403,
        body: 'This record is protect. User may only delete user created content. If you would like to delete a user created URL, please try again, but do not attempt to delete the entire record.' //return a message indicating that deletion of a protect record is not allowed
      }
    }

    if (deleteRecord === 0) {
      console.log('A. _______data[0]', data[0]);
      let name = data[0].name; //set temp variables to hold existing data
      let mainUrl = data[0].mainUrl;

      console.log('A.5. ______urlToDelete', urlToDelete);

      data[0].multipleUrl.splice(urlToDelete, 1); //updated the user-created url array, remove the selected index position

      let multipleUrl = data[0].multipleUrl;

      //TO DO:
      //TURN STRINGIFIED RESULT INTO AN ARRAY
      //TRY TO ALTER ARRAY TO REMOVE CHOSEN INDEX POINT
      //IF WE LET MULTIPLEURL = [], IT DELETES EVERYTHING IN IT
      //PROFIT

      let description = data[0].description;

      // console.log('wow, what a let down', typeof(multipleUrl));

      const updatedData = await moduleDocsModel.update({ id, name, mainUrl, multipleUrl, description, protect }); //update the record - only update should be in the multipleUrl

      console.log('__Updated Record__: ', updatedData);

      return {
        statusCode: 200,
        body: JSON.stringify(updatedData) //return updated record
      }
    }

  } catch (e) {
    console.log('-------------error message ----------', e)
    return {

      statusCode: 500,
      response: e.message
    }
  }
}


//console log city------------------
      // console.log('B. _______mainUrl', mainUrl);
      // console.log('C. _______before deleting a Url', data[0].multipleUrl)
      // console.log('C.Part2 _______before deleting a Url', typeof(data[0].multipleUrl));
      // console.log('let\'s turn this bad boi into an array with Object.keys', Object.keys(data[0].multipleUrl));
      // console.log('type of....let\'s turn this bad boi into an array with Object.keys', typeof(Object.keys(data[0].multipleUrl)));
      // console.log('_____array.from to change it? what will it be?', Array.from(data[0].multipleUrl));
      // console.log('type of _____array.from to change it? what will it be?', typeof(Array.from(data[0].multipleUrl)));
      // console.log('Object.entries to change our fake object into a real array', Object.entries(data[0].multipleUrl))
      // console.log('type of Object.entries to change our fake object into a real array', typeof(Object.entries(data[0].multipleUrl)))

      // console.log('C.Part2 _______before deleting a Url', data[0].multipleUrl)
      // let multipleUrl = JSON.stringify(data[0].multipleUrl) //we'll come back to you...don't worry <--------------
      //--------------------------



      //--------------------------
      //you are now leaving console log city, thank you for visiting

      // console.log('D. _______delete 1 url from multipleUrl', multipleUrl)