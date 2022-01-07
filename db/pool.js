const { Pool, types } = require('pg');
const devConfig = require('./devConfig');

types.setTypeParser(1700, function(val) {
    return parseFloat(val);
});

// instantiate pool 
const pool = new Pool(devConfig);

module.exports = pool;