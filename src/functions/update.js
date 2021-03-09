'use strict';


const Collection = require('../models/dataCollection.js');
const mods = new Collection();

const updateHandler = async (req, res) => {

// console.log('UPDATE updateHandler req.body ', req.body);

  let { updateUrl } = req.body;

  const id = req.params.id

  try {
    let data;

    data = await mods.get(id);

// console.log('UPDATE updateHandler data ', data);
    
    let name = data.name;
    let mainUrl = data.mainUrl;
    let multipleUrl = data.multipleUrl.concat(updateUrl);
    let description = data.description;
    let protect = data.protect;
    let dbID = data._id;
    let updatedObj = { name, mainUrl, multipleUrl, description, protect }

    const updatedData = await mods.update(dbID, updatedObj);
  
// console.log('UPDATE updateHandler updatedData ', updatedData);

    res.status(200).json(updatedData);

  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = updateHandler;