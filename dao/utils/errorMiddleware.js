const { CustomError } = require('./errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'An internal error occurred' });
  }
};

module.exports = {
  errorHandler,
};
