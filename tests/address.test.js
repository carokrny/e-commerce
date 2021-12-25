const app = require('../app');
const request = require('supertest');
const { user2, 
        addressPost, 
        addressPut,
        differentAddressId } = require('./testData');
const User = require('../models/UserModel');

describe ('Address endpoints', () => {

    var token;
    var addressId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/login')
            .send(user2);
        token = res.body.token;
    }),

    describe('POST \'/account/address\'', () => {
        
        describe('Valid token', () => {

            describe('Valid inputs', () => {

                it ('Should create a new address', async () => {
                    const res = await request(app)
                        .post('/account/address')
                        .send(addressPost)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res.body).toBeDefined();
                    expect(res.body.address).toBeDefined();
                    expect(res.body.address.id).toBeDefined();
                    expect(res.body.address.user_id).toEqual(user2.id);
                    addressId = res.body.address.id;
                })
            }), 

            describe('Invalid inputs', () => {

                it ('Should return a 400 error', (done) => {
                    request(app)
                        .post('/account/address')
                        .send({ ...addressPost, country: null })
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .post('/account/address')
                    .send(addressPost)
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

    describe('GET \'/account/address/address_id\'', () => {
        
        describe('Valid token', () => {

            describe('Valid user_id', () => {

                it ('Should return the address', async () => {
                    const res = await request(app)
                        .get(`/account/address/${addressId}`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.address).toBeDefined();
                    expect(res.body.address.id).toEqual(addressId);
                    expect(res.body.address.user_id).toEqual(user2.id);
                })
            }), 

            describe('Invalid user_id for the address', () => {

                it ('Should return a 409 error', (done) => {
                    request(app)
                        .get(`/account/address/${differentAddressId}`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(409)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/account/address/${addressId}`)
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

    describe('GET \'/account/address/all\'', () => {
        
        describe('Valid token', () => {

            it ('Should return the address', async () => {
                const res = await request(app)
                    .get(`/account/address/all`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.addresses).toBeDefined();
                expect(res.body.addresses[0]).toBeDefined();
                expect(res.body.addresses[0].id).toEqual(addressId);
                expect(res.body.addresses[0].user_id).toEqual(user2.id);
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/account/address/all`)
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

    describe('PUT \'/account/address/address_id\'', () => {
        
        describe('Valid token', () => {

            describe('Valid user_id', () => {

                it ('Should update and return the address', async () => {
                    const res = await request(app)
                        .put(`/account/address/${addressId}`)
                        .send(addressPut)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.address).toBeDefined();
                    expect(res.body.address.id).toEqual(addressId);
                    expect(res.body.address.user_id).toEqual(user2.id);
                    expect(res.body.address.address1).toEqual(addressPost.address1);
                    expect(res.body.address.address2).toEqual(addressPut.address2);
                })
            }), 

            describe('Extra input field', () => {

                it ('Should ignore extra field and update address', async () => {
                    const res = await request(app)
                        .put(`/account/address/${addressId}`)
                        .send({ ...addressPut, telephone: 1234567890 })
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.address).toBeDefined();
                    expect(res.body.address.id).toEqual(addressId);
                    expect(res.body.address.user_id).toEqual(user2.id);
                    expect(res.body.address.address1).toEqual(addressPost.address1);
                    expect(res.body.address.address2).toEqual(addressPut.address2);
                    expect(res.body.address.telephone).not.toBeDefined();
                })
            }), 

            describe('Invalid user_id for the address', () => {

                it ('Should return a 409 error', (done) => {
                    request(app)
                        .put(`/account/address/${differentAddressId}`)
                        .send(addressPut)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(409)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .put(`/account/address/${addressId}`)
                    .send(addressPut)
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

    describe('DELETE \'/account/address/address_id\'', () => {
        
        describe('Valid token', () => {

            describe('Valid user_id', () => {

                describe('Address is primary address', () => {

                    it ('Should delete and return the address', async () => {
                        // update address to be user's primary address
                        var user = await User.findByEmail(user2.email);
                        await User.update({ ...user, primary_address_id: addressId });

                        const res = await request(app)
                            .delete(`/account/address/${addressId}`)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.address).toBeDefined();
                        expect(res.body.address.id).toEqual(addressId);
                        expect(res.body.address.user_id).toEqual(user2.id);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                        expect(res.body.address.address2).toEqual(addressPut.address2);

                        // verify that primary_address_id has been reset to null
                        user = await User.findByEmail(user2.email);
                        expect(user.primary_address_id).toEqual(null);
                    })
                })
            }), 

            describe('Invalid user_id for the address', () => {

                it ('Should return a 409 error', (done) => {
                    request(app)
                        .delete(`/account/address/${differentAddressId}`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(409)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .delete(`/account/address/${addressId}`)
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


})