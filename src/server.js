'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

//App middleware
app.use(cors()); 
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('routes connected');
})

app.get('/home', (req, res) => {
  res.status(200).send('Mod-S Server is ready for action.');
})

//Catchalls
// app.use('*', notFound);
// app.use(errorHandler);

// function start(PORT) {
//     app.listen(PORT, () => {
//       console.log('Listening on port', PORT);
//       if (!PORT) { throw new Error('There is no port'); }
//     })
//   }
  
//   module.exports = {
//     server: app,
//     start: start
//   }

  module.exports = {
    server: app,
    start: (port) => {
      app.listen(port, () => {
        console.log(`Server Up on ${port}`);
      });
    },
  };