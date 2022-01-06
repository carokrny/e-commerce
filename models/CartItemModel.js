const db = require('../db');

class CartItem {

    /**
    * Adds new cart item to the database
    * 
    * @param {Object} data Contains data about new cart item
    * @return {Oject} The new cart item
    */
    async create(data) {
        try {
            // pg statement
            const statement = `WITH new_cart_item AS (
                                    INSERT INTO cart_items (cart_id, product_id, quantity)
                                    VALUES ($1, $2, $3)
                                    RETURNING *
                                )
                                SELECT 
	                                new_cart_item.*, 
                                    products.name,
                                    products.price * new_cart_item.quantity AS "total_price", 
                                    products.description,
                                    products.in_stock
                                FROM new_cart_item 
                                JOIN products 
	                                ON new_cart_item.product_id = products.id`;
            
            // pg values 
            const values = [data.cart_id, data.product_id, data.quantity]
            
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
     * Updates cart item in database , if exists
     *
     * @param {Object} data
     * @return {Object|null} the cart item
     */
    async update(data) {
        try {
            // pg statement
            const statement = `WITH updated AS (
                                    UPDATE cart_items  
	                                SET quantity=$3, modified=now()
	                                WHERE cart_id=$1 AND product_id=$2 
                                    RETURNING *
                                )
                                SELECT 
	                                updated.*, 
                                    products.name,
                                    products.price * updated.quantity AS "total_price", 
                                    products.description,
                                    products.in_stock
                                FROM updated 
                                JOIN products 
	                                ON updated.product_id = products.id`;
            
            // pg values
            const values = [data.cart_id, data.product_id, data.quantity];

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
     * Returns cart items associated with cart_id in database, if exists
     *
     * @param {number} cart_id the cart_id to find cart items based on
     * @return {Array|null} the cart items
     */
    async findInCart(cart_id) {
        try {
            // pg statement
            const statement = `WITH cart AS (
                                    SELECT * 
                                    FROM cart_items 
                                    WHERE cart_id = $1
                                )
                                SELECT 
	                                cart.*, 
                                    products.name,
                                    products.price * cart.quantity AS "total_price", 
                                    products.description,
                                    products.in_stock
                                FROM cart 
                                JOIN products 
	                                ON cart.product_id = products.id;`;

            // pg values
            const values = [cart_id];

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
     * Returns cart item from database based on cart_id and product_id, if exists
     *
     * @param {Object} data
     * @return {Object|null} the cart item
     */
    async findOne(data) {
        try {
            // pg statement
            const statement = `SELECT
                                    cart_items.*, 
                                    products.name,
                                    products.price * cart_items.quantity AS "total_price", 
                                    products.description,
                                    products.in_stock
                                FROM cart_items 
                                JOIN products 
	                                ON cart_items.product_id = products.id
                                WHERE cart_id = $1 
                                    AND product_id = $2`;
            
            // pg values
            const values = [data.cart_id, data.product_id];

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
     * Deletes cart item from database , if exists
     *
     * @param {Object} data
     * @return {Object|null} the cart item
     */
    async delete(data) {
        try {
            // pg statement
            const statement = `WITH deleted_item AS (
                                    DELETE FROM cart_items  
                                    WHERE cart_id=$1 AND product_id=$2
                                    RETURNING *
                                )
                                SELECT 
	                                deleted_item.*, 
                                    products.name,
                                    products.price * deleted_item.quantity AS "total_price", 
                                    products.description,
                                    products.in_stock
                                FROM deleted_item 
                                JOIN products 
	                                ON deleted_item.product_id = products.id;`;
            
            // pg values
            const values = [data.cart_id, data.product_id];

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

module.exports =  new CartItem();