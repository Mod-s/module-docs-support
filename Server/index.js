// 'use strict';

// require('dotenv').config();
// console.log('WHATS THE PORT: ', process.env.PORT);
// const mongoose = require('mongoose');
// const options = { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };

// mongoose.connect(process.env.MONGOOSE_URI, options);


// const server = require('./src/server')

// server.start(process.env.PORT);


'use strict';

require('dotenv').config();
 console.log('WHATS THE PORT: ', process.env.PORT);
// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGOOSE_URI, options);

// Start the web server
require('./src/server').start(process.env.PORT);