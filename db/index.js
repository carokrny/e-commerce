"use strict";
const pool = require('./config');

// export query
module.exports = {
    query: (text, params) => {
        return pool.query(text, params)
    }
};