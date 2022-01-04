const app = require('../app');
const request = require('supertest');
const { user, userAccountPut, addressPost, cardPost } = require('./testData');
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
            
            /*describe('Put that updates primary_address_id', () => {

                var address; 

                beforeAll(async () => {
                    address = await Address.create({ ...addressPost, user_id: user.id });
                }), 

                afterAll(async() => {
                    // reset user 
                    const testUser = await User.findById(user.id);
                    await User.update({ ...testUser, primary_address_id: null });

                    // delete address
                    await Address.delete(address.id);
                }), 

                describe('Address matches user id', () => {

                    it('Updates the primary_address_id to address id', async () => {
                        const res = await request(app)
                            .put(`/account/`)
                            .send({ primary_address_id: address.id })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user.id);
                        expect(res.body.user.email).toEqual(user.email);
                        expect(res.body.user.primary_address_id).toEqual(address.id);
                    })
                }), 

                describe('Address does not match user id', () => {

                    it ('Should ignore the put', async () => {
                        const res = await request(app)
                            .put(`/account/`)
                            .send({ primary_address_id: 229 })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user.id);
                        expect(res.body.user.email).toEqual(user.email);
                        expect(res.body.user.primary_address_id).toEqual(address.id);
                    })
                }), 

                describe('Address does not exist', () => {

                    it ('Should ignore the put', async () => {
                        const res = await request(app)
                            .put(`/account/`)
                            .send({ primary_address_id: 7 })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user.id);
                        expect(res.body.user.email).toEqual(user.email);
                        expect(res.body.user.primary_address_id).toEqual(address.id);
                    })
                })
            }), */

            /*describe('Put that updates primary_payment_id', () => {

                var address; 
                var card;

                beforeAll(async () => {
                    // create a billing address
                    address = await Address.create({ 
                        ...addressPost, 
                        user_id: user.id 
                    });

                    // create a card for payment
                    card = await Card.create({ 
                        ...cardPost, 
                        billing_address_id: address.id, 
                        user_id: user.id 
                    });
                }), 

                afterAll(async() => {
                    // reset user 
                    const testUser = await User.findById(user.id);
                    await User.update({ ...testUser, primary_payment_id: null });

                    // delete card 
                    await Card.delete(card.id);

                    // delete address
                    await Address.delete(address.id);
                }), 

                describe('Card matches user id', () => {

                    it('Updates the primary_payment_id to card id', async () => {
                        const res = await request(app)
                            .put(`/account/`)
                            .send({ primary_payment_id: card.id })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user.id);
                        expect(res.body.user.email).toEqual(user.email);
                        expect(res.body.user.primary_payment_id).toEqual(card.id);
                    })
                }), 

                describe('Card does not match user id', () => {

                    it ('Should ignore the put', async () => {
                        const res = await request(app)
                            .put(`/account/`)
                            .send({ primary_payment_id: 162 })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user.id);
                        expect(res.body.user.email).toEqual(user.email);
                        expect(res.body.user.primary_payment_id).toEqual(card.id);
                    })
                }), 

                describe('Card does not exist', () => {

                    it ('Should ignore the put', async () => {
                        const res = await request(app)
                            .put(`/account/`)
                            .send({ primary_payment_id: 7 })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.user).toBeDefined();
                        expect(res.body.user.id).toEqual(user.id);
                        expect(res.body.user.email).toEqual(user.email);
                        expect(res.body.user.primary_payment_id).toEqual(card.id);
                    })
                })
            })*/
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