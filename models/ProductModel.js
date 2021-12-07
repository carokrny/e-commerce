const db = require('../db');

module.exports = class Product {

    /**
     * Returns product associated with id in database, if exists
     *
     * @param {number} id the id to find product based on
     * @return {Object|null} the product
     */
    async findById(id) {
        try {
            // pg statement
            const statement = `SELECT * FROM products WHERE id = $1`;

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
     * Returns products in the specified category, if exists
     *
     * @param {string} category the catgory to find products based on
     * @return {Object|null} the product(s) in the category
     */
    async findByCategory(category) {
        try {
            // pg statement
            const statement = `SELECT * FROM products WHERE category = $1`;

            // make query
            const result = await db.query(statement, [category]);

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
     * Returns all products in the database
     *
     * @return {Object|null} the product(s), if there are any on the database
     */
    async getAll() {
        try {
            // pg statement
            const statement = `SELECT * FROM products`;

            // make query
            const result = await db.query(statement);

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
}