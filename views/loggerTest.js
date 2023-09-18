// routes/loggerTest.js

const express = require('express');
const router = express.Router();
const logger = require('../config/logging');

router.get('/', (req, res) => {
  logger.debug('This is a debug log for /loggerTest');
  logger.info('This is an info log for /loggerTest');
  logger.warn('This is a warning log for /loggerTest');
  logger.error('This is an error log for /loggerTest');
  res.send('Logger test completed.');
});

module.exports = router;
