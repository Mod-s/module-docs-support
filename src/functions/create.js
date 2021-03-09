'use strict';

// const uuid = require('uuid').v4;
// const moduleDocsModel = require('../models/modules.schema.js');
const Collection = require('../models/dataCollection.js');
const mods = new Collection();


//TODO: Refactor event to req, res
//TODO: Refactor response

const createHandler = async (req, res) => { 

console.log('CREATE createHandler req.body ', req.body);

  const { name, mainUrl, multipleUrl, description, protect } = JSON.parse(req.body);

  if (protect === null) (protect = false); //error catch for empty protect fiedl

  try {
    const record = req.body;
    const data = await mods.create(record);
    res.status(201).json(data);
  } catch (e) {
    return {
      statusCode: 500,
      response: e.message
    }
  }
};

module.exports = createHandler;