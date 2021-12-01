"use strict";
const { Pool } = require('pg');

require('dotenv').config();

// configurations for development 
const devConfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
};

// instantiate pool 
const pool = new Pool(devConfig);

// export query
module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    }
};