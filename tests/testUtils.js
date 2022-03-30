/**
 * Helper functions for running tests 
 */
const app = require('../app');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { genPassword } = require('../lib/customAuth/passwordUtils');
const User = require('../models/UserModel');


/**
 * Creates a new fake user using faker.js
 * @return Obj of user
 * 
 */
const createUser = () => {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const password = faker.random.alphaNumeric(10);
    const email = `${first_name}_${last_name}@me.com`;

    return {
        first_name, 
        last_name, 
        password, 
        email
    }
}

/**
 * Adds a user to the db 
 * @param user has properties:
 *  - email
 *  - password
 *  - first_name
 *  - last_name
 * @return object with token and id 
 */
 const registerUser = async (user) => {
    // request token with user data
    const res = await request(app)
            .post('/register')
            .send(user);

    // return token and id
    return { 
        id: res.body.user.id,
        token: res.body.token 
    };
}


/**
 * Creates a new user from faker.js
 * Logs user in to generate auth token
 * @returns Object with token and user data
 */
const loginUser = async (user) => {
    // request token with user data
    const res = await request(app)
            .post('/login')
            .send(user);

    // return token 
    return res.body.token;
}


module.exports = {
    createUser, 
    registerUser,
    loginUser
}