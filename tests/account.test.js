const app = require('../app');
const session = require('supertest-session');
const { loginUser } = require('./testUtils');
const { user1 } = require('./testData').users;
const { userAccountPut,
    xssAttack } = require('./testData');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');
const Card = require('../models/CardModel');

describe ('Account endpoints', () => {

    let testSession;

    beforeEach(async () => {
        // create a test session for saving functional cookies
        testSession = session(app);

        // log user in
        try {
            await loginUser(user1, testSession);
        } catch(e) {
            console.log(e);
        }
    })

    afterEach(() => {
        // wipe cookies after each test
        testSession = null;
    })

    describe('GET \'/account\'', () => {
        
        describe('Valid JWT in cookie', () => {

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

        describe('Valid JWT in bearer token', () => {

            let token;

            beforeEach(async () => {
                testSession = null;
                testSession = session(app);
                
                try {
                    const res = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json');
                    token = res.body.token;
                } catch(e) {
                    console.log(e);
                }
            })

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

        describe('Invalid auth', () => {
            
            beforeEach(() => {
                testSession = session(app);
            })

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
    })

    describe('PUT \'/account/\'', () => {

        describe('Valid JWT in cookie', () => {
            
            describe('Put that updates first_name', () => {

                it ('Should return user info', async () => {
                    const res = await testSession
                        .put(`/account/`)
                        .send(userAccountPut)
                        .set('Accept', 'application/json')
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

        describe('Invalid auth', () => {
            
            beforeEach(() => {
                testSession = session(app);
            })

            it ('Should return 401 error', (done) => {
                testSession
                    .put(`/account/`)
                    .send(userAccountPut)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
        
        describe('XSS attack on first_name field', () => {

            it ('Should be return 400 because escaped XSS attack is longer than characters permitted', (done) => {
                testSession
                    .put(`/account/`)
                    .send({...userAccountPut,
                        first_name: xssAttack})
                    .set('Accept', 'application/json')
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
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
    })
})