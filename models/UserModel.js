const db = require('../db');

class User {

    /**
    * Adds new user to the database
    * 
    * @param {Object} data Data about user
    * @return {Oject|null} The new user
    */
    async create(data) {
        try {
            // pg statement
            const statement = `INSERT INTO users (email, pw_hash, pw_salt) 
                                VALUES ($1, $2, $3) 
                                RETURNING *`;

            // pg values
            const values = [data.email, data.hash, data.salt];
            
            // make query
            const result = await db.query(statement, values);

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
    * Updates a user in the database
    * 
    * @param {Obj} data Data about user to update
    * @return {Oject|null} The updated user
    */
    async update(data) {
        try {
            // pg statement
            const statement = `UPDATE users  
                                SET email=$2, 
                                    pw_hash=$3, 
                                    pw_salt=$4, 
                                    first_name=$5, 
                                    last_name=$6, 
                                    primary_address_id=$7,
                                    primary_payment_id=$8,
                                    modified=now()
                                WHERE id = $1
                                RETURNING *`;
            
            // pg values
            const values = [data.id, 
                            data.email, 
                            data.pw_hash, 
                            data.pw_salt, 
                            data.first_name, 
                            data.last_name, 
                            data.primary_address_id, 
                            data.primary_payment_id];
            
            // make query
            const result = await db.query(statement, values);

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
    * Updates a user's primary_address_id in the database
    * 
    * @param {Obj} data Data about user to update
    * @return {Oject|null} The updated user
    */
    async updatePrimaryAddressId(data) {
        try {
            // pg statement
            const statement = `UPDATE users  
                                SET 
                                    primary_address_id=$2,
                                    modified=now()
                                WHERE id = $1
                                RETURNING *`;
            
            // pg values
            const values = [data.id, 
                            data.primary_address_id];
            
            // make query
            const result = await db.query(statement, values);

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
    * Updates a user's primary_payment_id in the database
    * 
    * @param {Obj} data Data about user to update
    * @return {Oject|null} The updated user
    */
    async updatePrimaryPaymentId(data) {
        try {
            // pg statement
            const statement = `UPDATE users  
                                SET 
                                    primary_payment_id=$2,
                                    modified=now()
                                WHERE id = $1
                                RETURNING *`;
            
            // pg values
            const values = [data.id,  
                            data.primary_payment_id];
            
            // make query
            const result = await db.query(statement, values);

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
     * @param {string} email the email to find user based on
     * @return {Object|null} the user
     */
    async findByEmail(email) {
        try {
            // pg statement
            const statement = `SELECT *
                                FROM users 
                                WHERE email = $1`;

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
     * @param {number} id the id to find user based on
     * @return {Object|null} the user
     */
    async findById(id) {
        try {
            // pg statement
            const statement = `SELECT *
                                FROM users 
                                WHERE id = $1`;

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

    /**
     * Deletes user associated with email in database, if exists
     * For use with testing, not for use with production. 
     *
     * @param {string} email the email to delete user based on
     * @return {Object|null} the user
     */
    async deleteByEmail(email) {
        try {
            // pg statement
            const statement = `DELETE FROM users  
                                WHERE email=$1
                                RETURNING *`

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
}

module.exports = new User();