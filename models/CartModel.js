const db = require('../db');

class Cart {

    /**
    * Adds new cart to the database
    * 
    * @param {number} user_id id of the user of the cart
    * @return {Oject} The new cart
    */
    async create(user_id) {
        try {
            // pg statement
            const statement = `INSERT INTO carts (user_id)
                                VALUES ($1)
                                RETURNING *`;
            
            // make query
            const result = await db.query(statement, [user_id]);

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
    * Updates a cart in the database
    * 
    * @param {Obj} data Data about cart to update
    * @return {Oject} The updated cart
    */
    async update(data) {
        try {
            // pg statement
            const statement = `UPDATE carts  
                                SET user_id=$2, modified=now()
                                WHERE id = $1
                                RETURNING *`;
            
            // pg values
            const values = [data.id, data.user_id];
            
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
     * Returns cart associated with id in database, if exists
     *
     * @param {number} id the id to find cart based on
     * @return {Object|null} the cart
     */
    async findById(id) {
        try {
            // pg statement
            const statement = `SELECT * FROM carts WHERE id = $1`;

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
     * Returns cart associated with user_id in database, if exists
     *
     * @param {number} user_id the id to find cart based on
     * @return {Object|null} the cart
     */
    async findByUserId(user_id) {
        try {
            // pg statement
            const statement = `SELECT * FROM carts WHERE user_id = $1`;

            // make query
            const result = await db.query(statement, [user_id]);

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
     * Deletes cart associated with id in database, if exists
     *
     * @param {number} id the id to delete cart based on
     * @return {Object|null} the cart
     */
    async delete(id) {
        try {
            // pg statement
            const statement = `DELETE FROM carts
                                WHERE id=$1
                                RETURNING *`;
            
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

module.exports = new Cart();