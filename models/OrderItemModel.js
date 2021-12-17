const db = require('../db');

class OrderItem {

    /**
    * Adds new order item to the database
    * 
    * @param {Object} data Contains data about new order item
    * @return {Oject} The new order item
    */
    async create(data) {
        try {
            // pg statement
            const statement = `INSERT INTO order_items (order_id, product_id, quantity)
                                VALUES ($1, $2, $3)
                                RETURNING *`;
            
            // pg values 
            const values = [data.order_id, data.product_id, data.quantity]
            
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
     * Returns order items associated with order_id in database, if exists
     *
     * @param {number} order_id the order_id to find order items based on
     * @return {Object|null} the order items
     */
    async findInOrder(order_id) {
        try {
            // pg statement
            const statement = `SELECT * 
                                FROM order_items 
                                WHERE order_id = $1`;

            // pg values
            const values = [order_id];

            // make query
            const result = await db.query(statement, values);

            // check for valid results
            if (result.rows.length > 0) {
                return result.rows;
            } else {
                return null;
            }
        } catch(err) {
            throw new Error(err);
        }
    }

    /**
     * Deletes order item from database , if exists
     *
     * @param {Object} data
     * @return {Object|null} the order item
     */
    async delete(data) {
        try {
            // pg statement
            const statement = `DELETE FROM order_items  
                                WHERE order_id=$1 AND product_id=$2
                                RETURNING *`;
            
            // pg values
            const values = [data.order_id, data.product_id];

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
}

module.exports = new OrderItem();