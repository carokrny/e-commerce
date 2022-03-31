const db = require('../../db');
const { users } = require('./index');

/**
 * Funtion to remove **ALL** data from associated tables in database
 * To run: 
 *         node tests/testData/removeAllData.js
 */
const removeAllData = async () => {
    console.log('Removing ALL data from associated tables in database...')

    /**
     * First, update primary address and primary payment of user7 to enable 
     * address and payment method to be deleted.
     */

    // pg statement
    let statement = `UPDATE users
        SET primary_address_id = $1, primary_payment_id = $2
        WHERE id=${users.user7.id};`;

    // pg values
    let values = [ null, null ];

    try {
        // make query
        await db.query(statement, values);
    } catch(e) {}

    /**
     * Then remove rest of data
     */

    // pg statement
    statement = `
        DELETE FROM order_items;
        DELETE FROM orders;
        DELETE FROM cards;
        DELETE FROM addresses;
        DELETE FROM cart_items;
        DELETE FROM carts;
        DELETE FROM products;
        DELETE FROM users;
        DELETE FROM session;`;

    // pg values
    values = [];

    try {
        // make query
        await db.query(statement, values);
    } catch(e) {
        console.log('Error removing all data.')
    }

    console.log('Done!');
}

// run function 
removeAllData();