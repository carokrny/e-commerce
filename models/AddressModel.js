const db = require('../db');

class Address {

    /**
    * Adds new address to the database
    * 
    * @param {data} data The address info to enter into database
    * @return {Oject} The new address
    */
    async create(data) {
        try {
            // pg statement
            const statement = `INSERT INTO addresses (address1, 
                                    address2, 
                                    city, 
                                    state, 
                                    zip, 
                                    country,
                                    user_id)
                                VALUES ($1, $2, $3, $4, $5, $6, $7)
                                RETURNING *`;

            // pg values
            const values = [data.address1, 
                            data.address2, 
                            data.city, 
                            data.state, 
                            data.zip, 
                            data.country,
                            data.user_id];
            
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
    * Updates an address in the database
    * 
    * @param {Object} data Data about address to update
    * @return {Oject} The updated address
    */
    async update(data) {
        try {
            // pg statement
            const statement = `UPDATE addresses  
                                SET address1=$2, 
                                    address2=$3, 
                                    city=$4, 
                                    state=$5, 
                                    zip=$6, 
                                    country=$7, 
                                    modified=now()
                                WHERE id = $1
                                RETURNING *`;
            
            // pg values
            const values = [data.id,
                            data.address1, 
                            data.address2, 
                            data.city, 
                            data.state, 
                            data.zip, 
                            data.country];
            
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
     * Returns address associated with id in database, if exists
     *
     * @param {number} id the id to find address based on
     * @return {Object|null} the address
     */
    async findById(id) {
        try {
            // pg statement
            const statement = `SELECT *
                                FROM addresses 
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
     * Returns all addresses associated with user_id in database, if exists
     *
     * @param {number} user_id the user's id to find address based on
     * @return {Arrray} the addresses
     */
    async findByUserId(user_id) {
        try {
            // pg statement
            const statement = `SELECT *
                                FROM addresses 
                                WHERE user_id = $1`;

            // make query
            const result = await db.query(statement, [user_id]);

            // check for valid results
            if (result.rows.length > 0) {
                return result.rows;
            } else {
                return [];
            }
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Deletes address associated with id in database, if exists
     *
     * @param {string} id the id to delete address based on
     * @return {Object|null} the address
     */
    async delete(id) {
        try {
            // pg statement
            const statement = `DELETE FROM addresses  
                                WHERE id=$1
                                RETURNING *`

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
}

module.exports = new Address();