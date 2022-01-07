const db = require('../db');

class Cart {

    /**
    * Adds new cart to the database
    * 
    * @param {number} user_id id of the user of the cart
    * @return {Oject|null} The new cart
    */
    async create(user_id) {
        try {
            // pg statement
            const statement = `WITH items AS (
	                                SELECT 
                                        cart_items.cart_id, 
  	                                    SUM(cart_items.quantity) AS "num_items",
  	                                    SUM(products.price * cart_items.quantity) AS "total"
                                    FROM cart_items 
                                    JOIN products 
                                        ON cart_items.product_id = products.id
                                    WHERE cart_items.cart_id = $1
                                    GROUP BY cart_items.cart_id
                                ), new_cart AS (
                                    INSERT INTO carts (user_id)
                                    VALUES ($1)
                                    RETURNING *
                                )
                                SELECT
	                                new_cart.*,
                                    CASE WHEN items.total IS NULL THEN 0.00 ELSE items.total END,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END  
                                FROM new_cart
                                LEFT JOIN items
	                                ON new_cart.id = items.cart_id`;
            
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
    * @return {Oject|null} The updated cart
    */
    async update(data) {
        try {
            // pg statement
            const statement = `WITH items AS (
	                                SELECT 
                                        cart_items.cart_id, 
  	                                    SUM(cart_items.quantity) AS "num_items",
  	                                    SUM(products.price * cart_items.quantity) AS "total"
                                    FROM cart_items 
                                    JOIN products 
                                        ON cart_items.product_id = products.id
                                    WHERE cart_items.cart_id = $1
                                    GROUP BY cart_items.cart_id
                                ), updated_cart AS (
                                    UPDATE carts  
                                    SET 
                                        user_id = $2, 
                                        modified = now()
                                    WHERE id = $1
                                    RETURNING *
                                )
                                SELECT
	                                updated_cart.*,
                                    CASE WHEN items.total IS NULL THEN 0.00 ELSE items.total END,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END  
                                FROM updated_cart
                                LEFT JOIN items
	                                ON updated_cart.id = items.cart_id`;
            
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
            const statement = `WITH items AS (
	                                SELECT 
                                        cart_items.cart_id, 
                                        SUM(cart_items.quantity) AS "num_items",
  	                                    SUM(products.price * cart_items.quantity) AS "total"
                                    FROM cart_items 
                                    JOIN products 
                                        ON cart_items.product_id = products.id
                                    WHERE cart_items.cart_id = $1
                                    GROUP BY cart_items.cart_id
                                )
                                SELECT
	                                carts.*,
                                    CASE WHEN items.total IS NULL THEN 0.00 ELSE items.total END,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END
                                FROM carts
                                LEFT JOIN items
	                                ON carts.id = items.cart_id
                                WHERE carts.id = $1`;

            // make query
            const result = await db.query(statement, [id]);

            // check for valid results
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch(err) {
            console.error(err.stack)
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
            const statement = `WITH items AS (
	                                SELECT 
                                        cart_items.cart_id, 
                                        SUM(cart_items.quantity) AS "num_items",
  	                                    SUM(products.price * cart_items.quantity) AS "total"
                                    FROM cart_items 
                                    JOIN products 
                                        ON cart_items.product_id = products.id
                                    WHERE cart_items.cart_id = $1
                                    GROUP BY cart_items.cart_id
                                )
                                SELECT
	                                carts.*,
                                    CASE WHEN items.total IS NULL THEN 0.00 ELSE items.total END,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END
                                FROM carts
                                LEFT JOIN items
	                                ON carts.id = items.cart_id
                                WHERE carts.user_id = $1`;

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
            const statement = `WITH items AS (
	                                SELECT 
                                        cart_items.cart_id, 
  	                                    SUM(cart_items.quantity) AS "num_items",
  	                                    SUM(products.price * cart_items.quantity) AS "total"
                                    FROM cart_items 
                                    JOIN products 
                                        ON cart_items.product_id = products.id
                                    WHERE cart_items.cart_id = $1
                                    GROUP BY cart_items.cart_id
                                ), deleted_cart AS (
                                    DELETE FROM carts
                                    WHERE id=$1
                                    RETURNING *
                                )
                                SELECT
	                                deleted_cart.*,
                                    CASE WHEN items.total IS NULL THEN 0.00 ELSE items.total END,
                                    CASE WHEN items.num_items IS NULL THEN 0 ELSE items.num_items::integer END  
                                FROM deleted_cart
                                LEFT JOIN items
	                                ON deleted_cart.id = items.cart_id`;
            
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