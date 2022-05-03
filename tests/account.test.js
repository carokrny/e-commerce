const app = require('../app');
const session = require('supertest-session');
const { loginUser, 
    createCSRFToken } = require('./testUtils');
const { user1 } = require('./testData').users;
const { userAccountPut,
    xssAttack } = require('./testData');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');
const Card = require('../models/CardModel');

describe ('Account endpoints', () => {

    describe('Valid auth', () => { 

        let testSession;
        let csrfToken;
        let token;
    
        beforeAll(async () => {
            // create a test session for saving functional cookies
            testSession = session(app);

            try {
                // create csrfToken
                csrfToken = await createCSRFToken(testSession);

                // log user in
                token = await loginUser(user1, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        describe('GET \'/account\'', () => {
            
            describe('JWT in cookie', () => {

                it ('Should return user info', async () => {
                    const res = await testSession
                        .get('/account')
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.user).toBeDefined();
                    expect(res.body.user.id).toEqual(user1.id);
                    expect(res.body.user.email).toEqual(user1.email);
                })
            })

            describe('JWT in bearer token', () => {

                it ('Should return user info', async () => {
                    const res = await testSession
                        .get('/account')
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.user).toBeDefined();
                    expect(res.body.user.id).toEqual(user1.id);
                    expect(res.body.user.email).toEqual(user1.email);
                })
            })
        })

        describe('PUT \'/account/\'', () => {

            describe('JWT in cookie', () => {
                
                describe('Put that updates first_name', () => {

                    it ('Should return user info', async () => {
                        const res = await testSession
                            .put(`/account/`)
                            .send(userAccountPut)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user1.id);
                        expect(res.body.user.email).toEqual(user1.email);
                        expect(res.body.user.first_name).toEqual(userAccountPut.first_name);
                    })
                })
            })
            
            describe('XSS attack on first_name field', () => {

                it ('Should be return 400 because escaped XSS attack is longer than characters permitted', (done) => {
                    testSession
                        .put(`/account/`)
                        .send({...userAccountPut,
                            first_name: xssAttack})
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })

            describe('XSS attack on last_name field', () => {

                it ('Should be return 400 because escaped XSS attack is longer than characters permitted', (done) => {
                    testSession
                        .put(`/account/`)
                        .send({...userAccountPut,
                            last_name: xssAttack})
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        })
    })

    describe('Invalid auth', () => { 

        let testSession;
        let csrfToken;
    
        beforeAll(async () => {
            // create a test session for saving functional cookies
            testSession = session(app);

            try {
                // create csrfToken
                csrfToken = await createCSRFToken(testSession);
            } catch(e) {
                console.log(e);
            }
        })

        describe('GET \'/account\'', () => {
            
            it ('Should return 401 error', (done) => {
                testSession
                    .get('/account')
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('PUT \'/account/\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .put(`/account/`)
                    .send(userAccountPut)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(401)
                    .end((err, res) => {
                        if (err) {
                            console.log(err);
                            return done(err);
                        }
                        return done();
                    });
            })
        })
    })
})