"use strict";
const pool = require('./pool');

// export query
module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    }
};