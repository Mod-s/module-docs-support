'use strict';
const server = require('./server.js');
// require('dotenv').config();


// Start up DB Server
// const mongoose = require('mongoose');
// const options = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// };
// mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
server.start(3000);
