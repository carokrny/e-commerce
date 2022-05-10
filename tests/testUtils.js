/**
 * Helper functions for running tests 
 */
const { faker } = require('@faker-js/faker');
const User = require('../models/UserModel');


/**
 * Creates a new fake user using faker.js
 * @return {Object} with properties: 
 *  - first_name
 *  - last_name
 *  - password
 *  - email
 * 
 */
const createUser = () => {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    // password with minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    const password = faker.internet.password(20, true, /"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"/)
    const email = `${first_name}_${last_name}@me.com`;

    return {
        first_name, 
        last_name, 
        password, 
        email
    }
}

/**
 * Adds a user to the db by registering and 
 * generates auth token in testSession cookie
 * 
 * @param {Object} user has properties:
 *  - email
 *  - password
 * @param {Object} testSession the test testSession
 * @param {String} csrfToken csrf token to verify authenticity of request
 * 
 * @return {Number} user id 
 */
 const registerUser = async (user, testSession, csrfToken) => {
     try {
        // log user in to get cookie with JWT
        const res = await testSession
            .post('/register')
            .send(user)
            .set('Accept', 'application/json')
            .set(`XSRF-TOKEN`, csrfToken);

        // return id and testSession w cookeies
        return res.body.user.id;
    } catch(e) {
        console.log(e);
    }
}


/**
 * Logs user in to generate auth token in cookies
 * 
 * @param {Object} user has properties:
 *   - email
 *   - password
 * @param {Object} testSession the test testSession
 * @param {String} csrfToken csrf token to verify authenticity of request
 * 
 * @return {Srting} JWT
 */
const loginUser = async (user, testSession, csrfToken) => {
    try {
        // log user in to get cookie with JWT
        const res = await testSession
            .post('/login')
            .send(user)
            .set('Accept', 'application/json')
            .set(`XSRF-TOKEN`, csrfToken);
        return res.body.token;
    } catch(e) {
        console.log(e);
    }
}

/**
 * Creates a new cart
 * 
 * @param {Object} testSession the test testSession
 * @param {String} csrfToken csrf token to verify authenticity of request
 * 
 * @return {Number} id of the new cart
 */
const createCart = async (testSession, csrfToken) => {
    try {
        const res = await testSession
            .post('/cart')
            .set('Accept', 'application/json')
            .set(`XSRF-TOKEN`, csrfToken);
        return res.body.cart.id;

    } catch(e) {
        console.log(e);
    }
}

/**
 * Creates a new cart item
 * 
 * @param {Object} product to add as a new cart item, has properties:
 *    - product_id: id of product 
 * @param {Object} testSession the test testSessions
 * @param {String} csrfToken csrf token to verify authenticity of request
 */
 const createCartItem = async (product, testSession, csrfToken) => {
    try {
        const res = await testSession
            .post(`/cart/item/${product.product_id}`)
            .send(product)
            .set('Accept', 'application/json')
            .set(`XSRF-TOKEN`, csrfToken);
        return res.body.cartItem.cart_id;
    } catch(e) {
        console.log(e);
    }
}



/**
 * Creates a new csrfToken
 * @param {Object} testSession the test testSessions
 * 
 * @return {String} XSRF Token value
 */
 const createCSRFToken = async (testSession) => {
    try {
        const res = await testSession
            .get(`/`)
            .set('Accept', 'application/json');
        const XSRFToken = testSession.cookies.find((cookie) => {
            return cookie.name === `XSRF-TOKEN`;
        });
        return XSRFToken.value;
    } catch(e) {
        console.log(e);
    }
}



/**
 * Gets an existing csrfToken
 * @param {Object} testSession the test testSessions
 * 
 * @return {String} XSRF Token value
 */
 const getCSRFToken = async (testSession) => {
    try {
        const XSRFToken = testSession.cookies.find((cookie) => {
            return cookie.name === `XSRF-TOKEN`;
        });
        return XSRFToken.value;
    } catch(e) {
        console.log(e);
    }
}



module.exports = {
    createUser, 
    registerUser,
    loginUser,
    createCart, 
    createCartItem,
    createCSRFToken,
    getCSRFToken
}