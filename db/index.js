"use strict";

const { Pool } = require('pg');
const { DB } = require('./devConfig');

const config = {
    user: DB.PGUSER,
    host: DB.PGHOST,
    database: DB.PGDATABASE,
    password: DB.PGPASSWORD,
    port: DB.PGPORT
};

const pool = new Pool(config);

module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    }
};