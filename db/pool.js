const { Pool, types } = require('pg');
const devConfig = require('./devConfig');

// cast numeric (OID 1700) as float (string is default in node-postgres)
types.setTypeParser(1700, function(val) {
    return parseFloat(val);
});

// instantiate pool 
const pool = new Pool(devConfig);

module.exports = pool;