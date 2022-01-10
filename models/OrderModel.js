const db = require('../db');

class Order {

    /**
    * Adds new order to the database
    * 
    * @param {Object} data data about the order 
    * @return {Oject|null} The new order
    */
    async create(data) {
        try {
            // pg statement
            const statement = `WITH items AS (
	                                SELECT 
		                                order_id, 
		                                SUM(quantity) AS "num_items"
	                                FROM order_items 
	                                WHERE order_id = $1
	                                GROUP BY order_id
                                ), new_order AS (
                                    INSERT INTO orders (user_id, 
                                        shipping_address_id, 
                                        billing_address_id, 
                                        payment_id, 
                                        amount_charged, 
                                        stripe_charge_id)
                                    VALUES ($1, $2, $3, $4, $5, $6)
                                    RETURNING *
                                )
                                SELECT 
                                    new_order.*,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END  
                                FROM new_order
                                LEFT JOIN items
	                                ON new_order.id = items.order_id`;

            // ph values 
            const values = [data.user_id, 
                            data.shipping_address_id, 
                            data.billing_address_id, 
                            data.payment_id, 
                            data.amount_charged, 
                            data.stripe_charge_id]
            
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
     * Returns order associated with id in database, if exists
     *
     * @param {number} id the id to find order based on
     * @return {Object|null} the order
     */
    async findById(id) {
        try {
            // pg statement
            const statement = `WITH items AS (
	                                SELECT 
		                                order_id, 
		                                SUM(quantity) AS "num_items"
	                                FROM order_items 
	                                WHERE order_id = $1
	                                GROUP BY order_id
                                )
                                SELECT
	                                orders.*,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END
                                FROM orders
                                LEFT JOIN items
	                                ON orders.id = items.order_id
                                WHERE orders.id = $1`;

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
     * Returns orders associated with user_id in database, if exists
     *
     * @param {number} user_id the user_id to find orders based on
     * @return {Array|null} the orders
     */
    async findByUserId(user_id) {
        try {
            // pg statement
            const statement = `WITH items AS (
	                                SELECT 
		                                order_id, 
		                                SUM(quantity) AS "num_items"
	                                FROM order_items 
	                                GROUP BY order_id
                                )
                                SELECT
	                                orders.*,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END
                                FROM orders
                                LEFT JOIN items
	                                ON orders.id = items.order_id
                                WHERE orders.user_id = $1`;

            // make query
            const result = await db.query(statement, [user_id]);

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
     * Deletes order associated with id in database, if exists
     *
     * @param {number} id the id to delete order based on
     * @return {Object|null} the order
     */
    async delete(id) {
        try {
            // pg statement
            const statement = `WITH items AS (
	                                SELECT 
		                                order_id, 
		                                SUM(quantity) AS "num_items"
	                                FROM order_items 
	                                GROUP BY order_id
                                ), deleted_order AS (
                                    DELETE FROM orders
                                    WHERE id=$1
                                    RETURNING *
                                )
                                SELECT
	                                deleted_order.*,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END  
                                FROM deleted_order
                                LEFT JOIN items
	                                ON deleted_order.id = items.order_id`;
            
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

module.exports = new Order();