require('ts-node').register();
require('dotenv').config(); // if you're using environment variables from .env
module.exports = require('./src/config/config.ts');
