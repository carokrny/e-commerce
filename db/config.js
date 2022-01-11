const { Pool, types } = require('pg');
//const { connectionString, isProduction } = require('./config');
require('dotenv').config();

// Heroku sets NODE_ENV to 'production'
const isProduction = process.env.NODE_ENV === 'production'; 

// connection string for development 
const devConfig = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

// cast numeric (OID 1700) as float (string is default in node-postgres)
types.setTypeParser(1700, function(val) {
    return parseFloat(val);
});

// instantiate pool 
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : devConfig,
    ssl: isProduction
});

module.exports = pool;