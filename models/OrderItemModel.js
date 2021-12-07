const db = require('../db');

module.exports = class OrderItem {

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
}