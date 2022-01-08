const { Pool, types } = require('pg');
const devConfig = require('./devConfig');

// cast numeric (OID 1700) as float (string is default in node-postgres)
types.setTypeParser(1700, function(val) {
    return parseFloat(val);
});

// cast date (OID 1082) as string (Date object with timestamp is default in node-postgres)
types.setTypeParser(1082, function(stringValue) {
  return stringValue; 
});

// instantiate pool 
const pool = new Pool(devConfig);

module.exports = pool;