const db = require('../db');

module.exports = class User {

    /**
    * Adds new user to the database
    * 
    * @param {Obj} data     Data about user
    */
    async create(data) {
        try {
            // pg statement
            const statement = `INSERT INTO users (email, pw_hash, pw_salt) 
                                VALUES ($1, $2, $3) 
                                RETURNING *`;
            
            // make query
            const result = await db.query(statement, [data.email, data.hash, data.salt]);

            // check for valid results
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Returns user associated with email in database, if exists
     *
     * @param {string} email    The email to find user based on
     * @return {Object|null}    The user
     */
    async findByEmail(email) {
        try {
            // pg statement
            const statement = `SELECT * FROM users WHERE email = $1`;

            // make query
            const result = await db.query(statement, [email]);

            // check for valid results
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Returns user associated with id in database, if exists
     *
     * @param {number} id       The id to find user based on
     * @return {Object|null}    The user
     */
    async findById(id) {
        try {
            // pg statement
            const statement = `SELECT * FROM users WHERE id = $1`;

            // make query
            const result = await db.query(statement, [id]);

            // check for valid results
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch(err) {
            throw new Error(err);
        }
    }
};