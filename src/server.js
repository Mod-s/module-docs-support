'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
const errorHandler = require('./error handlers/500.js');
const notFound = require('./error handlers/404.js');

//App middleware
app.use(cors()); 
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/mods', routes); //directs to routes page

app.get('/', (req, res) => {
  console.log('routes connected');
})

app.get('/test', (req, res) => {
  res.status(200).send('Mod-S Server is ready for action.');
})

//Catchalls
app.use('*', notFound);
app.use(errorHandler);

  module.exports = {
    server: app,
    start: (port) => {
      app.listen(port, () => {
        console.log(`Server Up on ${port}`);
      });
    },
  };