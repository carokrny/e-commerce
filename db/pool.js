const { Pool } = require('pg');
const devConfig = require('./devConfig');

// instantiate pool 
const pool = new Pool(devConfig);

module.exports = pool;