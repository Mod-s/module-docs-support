'use strict';


const Collection = require('../models/dataCollection.js');
const mods = new Collection();

//TODO: refactor for req/res
//TODO: refactor responses

const readHandler = async (req, res) => {

console.log('READ readHandler req.body ', req.body);

  let id;
  if (req.params) {
    id = req.params.id;
  };

  try {
    let data;

    if (id) {
      data = await mods.get(id);
    } else {
      data = await mods.get();
    }
    res.status(200).json(data)
  } catch (e) {
    return {
      statusCode: 500,
      response: e.message
    }
  }
}

module.exports = readHandler;