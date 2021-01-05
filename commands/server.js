'use strict';

// 3rd Party Resources
const express = require('express');

// Prepare the express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
