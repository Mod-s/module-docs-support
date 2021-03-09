'use strict';


const Collection = require('../models/dataCollection.js');
const mods = new Collection();

const readHandler = async (req, res) => {

// console.log('READ readHandler req.body ', req.body);

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
    res.status(500).send(e.message);
  }
}

module.exports = readHandler;