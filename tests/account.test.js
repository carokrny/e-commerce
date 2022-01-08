const app = require('../app');
const request = require('supertest');
const { user, 
        userAccountPut } = require('./testData');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');
const Card = require('../models/CardModel');

describe ('Account endpoints', () => {

    var token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/login')
            .send(user);
        token = res.body.token;
    }),

    describe('GET \'/account\'', () => {
        
        describe('Valid token', () => {

            it ('Should return user info', async () => {
                const res = await request(app)
                    .get('/account')
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.id).toEqual(user.id);
                expect(res.body.user.email).toEqual(user.email);
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get('/account')
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
    }),

    describe('PUT \'/account/\'', () => {

        describe('Valid token', () => {
            
            describe('Put that updates first_name', () => {

                it ('Should return user info', async () => {
                    const res = await request(app)
                        .put(`/account/`)
                        .send(userAccountPut)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.user).toBeDefined();
                    expect(res.body.user.id).toEqual(user.id);
                    expect(res.body.user.email).toEqual(user.email);
                    expect(res.body.user.first_name).toEqual(userAccountPut.first_name);
                })
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/account/`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
    })
});