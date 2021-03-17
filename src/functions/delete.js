'use strict';

const Collection = require('../models/dataCollection.js');
const mods = new Collection();
const deleteHandler = async (req, res) => {

  // console.log('DELETE deleteHandler req.body ', req.body);

  const id = req.params.id; //capture record id from the user
  console.log('DELETE id ', id);
  const { deleteRecord } = req.body; //user input requesting to delete record (users sends 1 to delete whole record or 0 to delete only a user url)
  const { urlToDelete } = req.body; //capture the index position of the user-generated url to delete
  
  console.log('DELETE req.body ', req.body);
  console.log('DELETE deleteRecord ', deleteRecord);
  console.log('DELETE urlToDelete ', urlToDelete);

  try {
    let data;

    data = await mods.get(id); //check DB for existing record
    let protect = data.protect; //set temp variable to hold the protect status of the record

    if (deleteRecord === 1 && protect === false) { //check if user wants to delete the whole record and the record is not protect
      await mods.delete(id); //delete the whole record
      res.status(200).send('Record deleted successfully');
    }

    if (deleteRecord === 1 && protect === true) { //check to see if user wants to delete the entire record and if it is protect
      res.status(403).send('This record is protected. User may only delete user created content. If you would like to delete a user created URL, please try again, but do not attempt to delete the entire record.'); //return a message indicating that deletion of a protected record is not allowed
      }
    
    if (deleteRecord === 0) {
      let name = data.name; //set temp variables to hold existing data
      let mainUrl = data.mainUrl;

      data.multipleUrl.splice(urlToDelete, 1); //update the user-created url array, remove the selected index position

      let multipleUrl = data.multipleUrl;
      let description = data.description;
      let deleteObject = {name, mainUrl, multipleUrl, description, protect};
      let dbID = data._id;

      const updatedData = await mods.update(dbID, deleteObject); //update the record - only update should be in the multipleUrl

      res.status(200).json(updatedData); //return updated record
      
    }

  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = deleteHandler;
