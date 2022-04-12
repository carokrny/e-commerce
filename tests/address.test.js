const app = require('../app');
const request = require('supertest');
const { user3 } = require('./testData').users;
const { addressPost, 
        addressPut,
        differentAddressId, 
        xssAttack } = require('./testData');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');

describe ('Address endpoints', () => {

    let token;
    let addressId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/login')
            .send(user3)
            .set('Accept', 'application/json');

        token = res.body.token;
    }),

    afterEach(async () => {
        // tear down address
        if(addressId) {
            try {
                await Address.delete(addressId);
                addressId = null;
            } catch(e) {}
        }
    }),

    describe('POST \'/account/address\'', () => {
        
        describe('Valid token', () => {

            describe('Valid inputs', () => {

                it ('Should create a new address', async () => {
                    const res = await request(app)
                        .post('/account/address')
                        .send({ ...addressPost, 
                            first_name: user3.first_name,
                            last_name: user3.last_name })
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res.body).toBeDefined();
                    expect(res.body.address).toBeDefined();
                    expect(res.body.address.id).toBeDefined();
                    expect(res.body.address.user_id).toEqual(user3.id);
                    expect(res.body.address.address1).toEqual(addressPost.address1);
                    expect(res.body.address.is_primary_address).toEqual(addressPost.is_primary_address);
                    addressId = res.body.address.id;
                })
            }), 

            describe('XSS attack', () => {

                it ('Should be return 400 because attack is longer than characters permitted', (done) => {
                    request(app)
                        .post('/account/address')
                        .send({ ...addressPost,
                            address1: addressPost.address1 + xssAttack,
                            first_name: user3.first_name,
                            last_name: user3.last_name })
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            }),

            describe('Invalid inputs', () => {

                it ('Should return a 400 error', (done) => {
                    request(app)
                        .post('/account/address')
                        .send({ ...addressPost,
                            country: null,
                            first_name: user3.first_name,
                            last_name: user3.last_name })
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
                    .send({ ...addressPost, 
                            first_name: user3.first_name,
                            last_name: user3.last_name })
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

    describe('Endpoints that require existing address', () => {

        beforeEach(async () => {
            // create address
            const res = await request(app)
                .post('/account/address')
                .send({ ...addressPost, 
                    first_name: user3.first_name,
                    last_name: user3.last_name })
                .set('Authorization', token)
                .set('Accept', 'application/json');
            addressId = res.body.address.id;
        }),

        afterEach(async () => {
            // tear down 
            try {
                await Address.delete(addressId);
                addressId = null;
            } catch(e) {}
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
                        expect(res.body.address.user_id).toEqual(user3.id);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                        expect(res.body.address.is_primary_address).toEqual(addressPost.is_primary_address);
                    })
                }), 

                describe('Invalid user_id for the address', () => {

                    it ('Should return a 403 error', (done) => {
                        request(app)
                            .get(`/account/address/${differentAddressId}`)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(403)
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
                    expect(res.body.addresses[0].user_id).toEqual(user3.id);
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

            afterEach(async () => {
                // addressPut updates address to be the user's primary_address_id
                // need to reset after each test to allow address to be deleted
                try {
                    await User.updatePrimaryAddressId({ id: user3.id, primary_address_id: null });
                } catch(e) {}
            }),
            
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
                        expect(res.body.address.user_id).toEqual(user3.id);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                        expect(res.body.address.address2).toEqual(addressPut.address2);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                        expect(res.body.address.is_primary_address).toEqual(addressPut.is_primary_address);
                        expect(res.body.address.is_primary_address).not.toEqual(addressPost.is_primary_address);
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
                        expect(res.body.address.user_id).toEqual(user3.id);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                        expect(res.body.address.address2).toEqual(addressPut.address2);
                        expect(res.body.address.telephone).not.toBeDefined();
                    })
                }), 

                describe('Invalid user_id for the address', () => {

                    it ('Should return a 403 error', (done) => {
                        request(app)
                            .put(`/account/address/${differentAddressId}`)
                            .send(addressPut)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(403)
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

                    it ('Should delete and return the address', async () => {
                        const res = await request(app)
                            .delete(`/account/address/${addressId}`)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.address).toBeDefined();
                        expect(res.body.address.id).toEqual(addressId);
                        expect(res.body.address.user_id).toEqual(user3.id);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                    })

                    describe('Address is primary address', () => {

                        beforeEach(async () => {
                            // update User's primary_address_id
                            try {
                                await User.updatePrimaryAddressId({ id: user3.id, primary_address_id: addressId });
                            } catch(e) {}
                        }),

                        it ('Should delete and return the address', async () => {
                            const res = await request(app)
                                .delete(`/account/address/${addressId}`)
                                .set('Authorization', token)
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /json/)
                                .expect(200);
                            expect(res.body).toBeDefined();
                            expect(res.body.address).toBeDefined();
                            expect(res.body.address.id).toEqual(addressId);
                            expect(res.body.address.user_id).toEqual(user3.id);
                            expect(res.body.address.address1).toEqual(addressPost.address1);

                            // verify that primary_address_id has been reset to null
                            user = await User.findByEmail(user3.email);
                            expect(user.primary_address_id).toEqual(null);
                        })
                    })
                }), 

                describe('Invalid user_id for the address', () => {

                    it ('Should return a 403 error', (done) => {
                        request(app)
                            .delete(`/account/address/${differentAddressId}`)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(403)
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
})