const db = require('../../db');
const { genPassword } = require('../../lib/customAuth/passwordUtils');
const { users, 
        products,
        carts,
        cart_items,
        addresses,
        cards,
        orders,
        order_items } = require('./index');

/**
 * Function to add test data to database
 * 
 */
const initTestData = async () => {
    /**
     * Add user data to table 
     * Need to use JS to add test user data to DB 
     * because of hashing and salting PW 
     * Hash and salt will be unique based on keypair generated on install
     */

    console.log('\nAdding test data to database table. Please wait...')

    for (const u in users) {
        try {
            // generate salt and hash of PW
            const hashedPW = await genPassword(users[u].password);

            // pg statement
            const statement = `INSERT INTO users (id, email, first_name, last_name, pw_hash, pw_salt) 
                            VALUES ($1, $2, $3, $4, $5, $6)`;

            // pg values
            const values = [ users[u].id,
                            users[u].email, 
                            users[u].first_name, 
                            users[u].last_name,
                            hashedPW.hash, 
                            hashedPW.salt ];

            // make query
            await db.query(statement, values);
        } catch(e) {
            break;
        }
    }

    // **********************************************************************
    /**
     * Add user data to table 
     * Use nested for loops to add remaining data
     */
    const testData = {
        products,
        carts,
        cart_items,
        addresses,
        cards,
        orders,
        order_items 
    }

    for (const table in testData) {
        
        for (const row in testData[table]) {
            // open pg statement
            let statement = `INSERT INTO ${table} (`;
            // open pg values portion of statement
            let valuesStatement = `VALUES (`;
            // instantiate counter
            let i = 1;
            // instantiate array of values
            let values = [];

            // iterate through columns and add to statement and values
            for (const col in testData[table][row]) {
                statement+=`${col}, `;
                valuesStatement+=`$${i}, `;
                i++;
                values.push(testData[table][row][col]);
            }

            // remove last comma and space from statement
            statement = statement.substring(0, statement.length - 2);
            valuesStatement = valuesStatement.substring(0, valuesStatement.length - 2);

            // close pg statement
            statement+=`) `;
            valuesStatement+=`)`;
                
            // concatenate statement and values portion of statement
            statement+=valuesStatement;

            // make query
            try {
                await db.query(statement, values);
            } catch(e) {
                break;
            }
        }
    }

    console.log(`Finishing up...`);

    /**
     * Lastly, in order to run some tests, 
     * need to update primary address and primary payment of user7
     */

    // pg statement
    const statement = `UPDATE users
        SET primary_address_id = $1, primary_payment_id = $2
        WHERE id=${users.user7.id};`;

    // pg values
    const values = [ users.user7.primary_address_id, users.user7.primary_payment_id ];

    try {
        // make query
        await db.query(statement, values);
    } catch(e) {}

    console.log(`Done!`);

}


// run function
initTestData();
