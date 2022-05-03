const app = require('../app');
const session = require('supertest-session');
const { loginUser,
    createCSRFToken } = require('./testUtils');
const { user3 } = require('./testData').users;
const { addressPost, 
        addressPut,
        differentAddressId, 
        xssAttack } = require('./testData');
const User = require('../models/UserModel');
const Address = require('../models/AddressModel');

describe ('Address endpoints', () => {

    let testSession;
    let csrfToken;
    let addressId;

    describe('Valid auth', () => {

        beforeAll(async () => {
            // create a test session for saving functional cookies
            testSession = session(app);

            try {
                // create csrfToken
                csrfToken = await createCSRFToken(testSession);

                // log user in
                await loginUser(user3, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })    

        describe('POST \'/account/address\'', () => {

            describe('Valid inputs', () => {

                it ('Should create a new address', async () => {
                    const res = await testSession
                        .post('/account/address')
                        .send({ ...addressPost, 
                            first_name: user3.first_name,
                            last_name: user3.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
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
            }) 

            describe('XSS attack on address1 field', () => {

                it ('Should be return 400 because attack is longer than characters permitted after being escaped', (done) => {
                    testSession
                        .post('/account/address')
                        .send({ ...addressPost,
                            address1: xssAttack,
                            first_name: user3.first_name,
                            last_name: user3.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })

            describe('XSS attack on zip field', () => {

                it ('Should be return 400 because attack is longer than characters permitted', (done) => {
                    testSession
                        .post('/account/address')
                        .send({ ...addressPost,
                            zip: xssAttack,
                            first_name: user3.first_name,
                            last_name: user3.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })

            describe('Invalid inputs', () => {

                it ('Should return a 400 error', (done) => {
                    testSession
                        .post('/account/address')
                        .send({ ...addressPost,
                            country: null,
                            first_name: user3.first_name,
                            last_name: user3.last_name })
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

        describe('Endpoints that require existing address', () => {

            beforeAll(async () => {
                // create address
                const res = await testSession
                    .post('/account/address')
                    .send({ ...addressPost, 
                        first_name: user3.first_name,
                        last_name: user3.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken);
                addressId = res.body.address.id;
            })

            afterAll(async () => {
                // tear down address
                try {
                    if (addressId) {
                        await Address.delete(addressId);
                        addressId = null;
                    } 
                } catch(e) {
                    console.log(e);
                }
            })

            describe('GET \'/account/address/address_id\'', () => {

                describe('Valid user_id', () => {

                    it ('Should return the address', async () => {
                        const res = await testSession
                            .get(`/account/address/${addressId}`)
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
                }) 

                describe('Invalid user_id for the address', () => {

                    it ('Should return a 403 error', (done) => {
                        testSession
                            .get(`/account/address/${differentAddressId}`)
                            .set('Accept', 'application/json')
                            .expect(403)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })

            describe('GET \'/account/address/all\'', () => {

                it ('Should return the address', async () => {
                    const res = await testSession
                        .get(`/account/address/all`)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.addresses).toBeDefined();
                    expect(res.body.addresses[0]).toBeDefined();
                    expect(res.body.addresses[0].user_id).toEqual(user3.id);
                })
            })

            describe('PUT \'/account/address/address_id\'', () => {

                afterEach(async () => {
                    // addressPut updates address to be the user's primary_address_id
                    // need to reset after each test to allow address to be deleted
                    try {
                        await User.updatePrimaryAddressId({ id: user3.id, primary_address_id: null });
                    } catch(e) {
                        console.log(e);
                    }
                })

                describe('Valid user_id', () => {

                    it ('Should update and return the address', async () => {
                        const res = await testSession
                            .put(`/account/address/${addressId}`)
                            .send(addressPut)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
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
                }) 

                describe('Extra input field', () => {

                    it ('Should ignore extra field and update address', async () => {
                        const res = await testSession
                            .put(`/account/address/${addressId}`)
                            .send({ ...addressPut, telephone: 1234567890 })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
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
                }) 

                describe('Invalid user_id for the address', () => {

                    it ('Should return a 403 error', (done) => {
                        testSession
                            .put(`/account/address/${differentAddressId}`)
                            .send(addressPut)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(403)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })


            describe('DELETE \'/account/address/address_id\'', () => {

                describe('Valid user_id', () => {

                    it ('Should delete and return the address', async () => {
                        const res = await testSession
                            .delete(`/account/address/${addressId}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.address).toBeDefined();
                        expect(res.body.address.id).toEqual(addressId);
                        expect(res.body.address.user_id).toEqual(user3.id);
                        expect(res.body.address.address1).toEqual(addressPost.address1);
                        addressId = null;
                    })

                    describe('Address is primary address', () => {

                        beforeEach(async () => {
                            // add address
                            const res = await testSession
                                .post('/account/address')
                                .send({ ...addressPost, 
                                    first_name: user3.first_name,
                                    last_name: user3.last_name })
                                .set('Accept', 'application/json')
                                .set(`XSRF-TOKEN`, csrfToken);
                            addressId = res.body.address.id;

                            // update User's primary_address_id
                            try {
                                await User.updatePrimaryAddressId({ id: user3.id, primary_address_id: addressId });
                            } catch(e) {
                                console.log(e);
                            }
                        })

                        it ('Should delete and return the address', async () => {
                            const res = await testSession
                                .delete(`/account/address/${addressId}`)
                                .set('Accept', 'application/json')
                                .set(`XSRF-TOKEN`, csrfToken)
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
                }) 

                describe('Invalid user_id for the address', () => {

                    it ('Should return a 403 error', (done) => {
                        testSession
                            .delete(`/account/address/${differentAddressId}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(403)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })
        })
    })

    describe('Invalid auth', () => {

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

        describe('POST \'/account/address\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .post('/account/address')
                    .send({ ...addressPost, 
                            first_name: user3.first_name,
                            last_name: user3.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('GET \'/account/address/address_id\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .get(`/account/address/${addressId}`)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('GET \'/account/address/all\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .get(`/account/address/all`)
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('PUT \'/account/address/address_id\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .put(`/account/address/${addressId}`)
                    .send(addressPut)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('DELETE \'/account/address/address_id\'', () => {

            it ('Should return 401 error', (done) => {
                testSession
                    .delete(`/account/address/${addressId}`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })
    })
})