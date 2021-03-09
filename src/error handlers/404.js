'use strict';

function handle404(req, res, next) {

  try {
    const errorObject = {
      status: 404,
      message: 'Sorry, we could not find what you were looking for'
    }

    res.setHeader('Content-Type', 'application/json');

    res.status(404).json(errorObject);
  }  catch (e) {
    throw new Error(e.message)
  }
}

module.exports = handle404;