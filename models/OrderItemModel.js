const db = require('../db');

class OrderItem {

    /**
    * Adds new order item to the database
    * 
    * @param {Object} data Contains data about new order item
    * @return {Oject|null} The new order item
    */
    async create(data) {
        try {
            // pg statement
            const statement = `WITH new_order_item AS (
                                    INSERT INTO order_items (order_id, product_id, quantity)
                                    VALUES ($1, $2, $3)
                                    RETURNING *
                                )
                                SELECT 
	                                new_order_item.*, 
                                    products.name,
                                    products.price * new_order_item.quantity AS "total_price", 
                                    products.description,
                                    products.quantity > 0 AS "in_stock"
                                FROM new_order_item 
                                JOIN products 
	                                ON new_order_item.product_id = products.id`;
            
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
     * @return {Array|null} the order items
     */
    async findInOrder(order_id) {
        try {
            // pg statement
            const statement = `WITH temporary_order AS (
                                    SELECT * 
                                    FROM order_items 
                                    WHERE order_id = $1
                                )
                                SELECT 
	                                temporary_order.*, 
                                    products.name,
                                    products.price * temporary_order.quantity AS "total_price", 
                                    products.description,
                                    products.quantity > 0 AS "in_stock"
                                FROM temporary_order 
                                JOIN products 
	                                ON temporary_order.product_id = products.id`;

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
            const statement = `WITH deleted_item AS (
                                    DELETE FROM order_items  
                                    WHERE order_id=$1 AND product_id=$2
                                    RETURNING *
                                )
                                SELECT 
	                                deleted_item.*, 
                                    products.name,
                                    products.price * deleted_item.quantity AS "total_price", 
                                    products.description,
                                    products.quantity > 0 AS "in_stock"
                                FROM deleted_item 
                                JOIN products 
	                                ON deleted_item.product_id = products.id`;
            
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