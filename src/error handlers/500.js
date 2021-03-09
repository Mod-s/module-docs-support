'use strict';

function handle500(err, req, res, next) {

  try {

    const error = err.message ? err.message : err;
    
    const errorObject = {
      status: 500,
      message: error
    }
    
    res.setHeader('Content-Type', 'application/json');
    
    res.status(500).json(errorObject);
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = handle500;