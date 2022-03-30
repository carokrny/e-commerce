const db = require('../../db');
const { users, 
        products,
        carts,
        cart_items,
        addresses,
        cards,
        orders,
        order_items } = require('./index');

/**
 * Function to remove test data from database
 * 
 */
const removeTestData = async () => {
    console.log('Removing test data. Please wait...');

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
     * Now delete rest of data 
     * Order is important!
     */
    const testData = {
        order_items,
        orders,
        cards,
        addresses, 
        cart_items, 
        carts, 
        products, 
        users,      
    }

    for (const table in testData) {
        
        for (const row in testData[table]) {
            // open pg statement
            statement = `DELETE FROM ${table} WHERE `;
            // instantiate counter
            let i = 1;
            // instantiate array of values
            values = [];

            // iterate through columns and add to statement and values
            for (const col in testData[table][row]) {
                // skip certain user properties
                if (col !== 'password' && col !== 'primary_address_id' && col!=='primary_payment_id'){
                    statement+=`${col} = $${i} AND `;
                    i++;
                    values.push(testData[table][row][col]);
                }
            }

            // remove last AND and space from statement
            statement = statement.substring(0, statement.length - 5);
            
            // make query
            try {
                await db.query(statement, values);
            } catch(e) {
                break;
            }
        }
    }

    console.log('Test data removed from database.')
}

// run function 
removeTestData();