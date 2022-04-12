/**
 * Helper functions for running tests 
 */
const app = require('../app');
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const User = require('../models/UserModel');


/**
 * Creates a new fake user using faker.js
 * @return Obj of user
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
        .send(user)
        .set('Accept', 'application/json');

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
        .send(user)
        .set('Accept', 'application/json');

    // return token 
    return res.body.token;
}


module.exports = {
    createUser, 
    registerUser,
    loginUser
}