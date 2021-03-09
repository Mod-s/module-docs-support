'use strict';

const Collection = require('../models/dataCollection.js');
const mods = new Collection();

const createHandler = async (req, res) => { 

// console.log('CREATE createHandler req.body ', req.body);

  const { name, mainUrl, multipleUrl, description, protect } = req.body;

  if (protect === null) (protect = false); //error catch for empty protect field

  try {
    const record = req.body;
    const data = await mods.create(record);
    res.status(201).json(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = createHandler;