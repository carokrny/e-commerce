const app = require('../app');
const request = require('supertest');
const { testLogin, 
        userId, 
        cardPost, 
        cardPut,
        invalidCardPost, 
        invalidCardPut,
        differentPaymentId } = require('./testData');
const User = require('../models/UserModel');

describe ('Account payment method endpoints', () => {

    var token;
    var paymentId;

    beforeAll(async () => {
        const res = await request(app)
            .post('/login')
            .send(testLogin);
        token = res.body.token;
    }),

    describe('POST \'/account/payment\'', () => {
        
        describe('Valid token', () => {

            describe('Valid inputs', () => {

                it ('Should create a new payment method', async () => {
                    const res = await request(app)
                        .post('/account/payment')
                        .send(cardPost)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res.body).toBeDefined();
                    expect(res.body.payment).toBeDefined();
                    expect(res.body.payment.id).toBeDefined();
                    expect(res.body.payment.user_id).toEqual(userId);
                    paymentId = res.body.payment.id;
                })
            }), 

            describe('Invalid inputs', () => {

                describe('Null input field', () => {

                    it ('Should return a 400 error', (done) => {
                        request(app)
                            .post('/account/payment')
                            .send({ ...cardPost, card_no: null })
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(400)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                }),

                describe('Invalid card format', () => {

                    it ('Should return a 400 error', (done) => {
                        request(app)
                            .post('/account/payment')
                            .send(invalidCardPost)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect(400)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .post('/account/payment')
                    .send(cardPost)
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

    describe('GET \'/account/payment/payment_id\'', () => {
        
        describe('Valid token', () => {

            describe('Valid user_id', () => {

                it ('Should return the payment method', async () => {
                    const res = await request(app)
                        .get(`/account/payment/${paymentId}`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.payment).toBeDefined();
                    expect(res.body.payment.id).toEqual(paymentId);
                    expect(res.body.payment.user_id).toEqual(userId);
                })
            }), 

            describe('Invalid user_id for the payment', () => {

                it ('Should return a 409 error', (done) => {
                    request(app)
                        .get(`/account/payment/${differentPaymentId}`)
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
                    .get(`/account/payment/${paymentId}`)
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

    describe('GET \'/account/payment/all\'', () => {
        
        describe('Valid token', () => {

            it ('Should return the payment methods', async () => {
                const res = await request(app)
                    .get(`/account/payment/all`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.payments).toBeDefined();
                expect(res.body.payments[0]).toBeDefined();
                expect(res.body.payments[0].id).toEqual(paymentId);
                expect(res.body.payments[0].user_id).toEqual(userId);
            })
        }),

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/account/payment/all`)
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

    describe('PUT \'/account/payment/payment_id\'', () => {
        
        describe('Valid token', () => {

            describe('Valid user_id', () => {

                it ('Should update and return the payment', async () => {
                    const res = await request(app)
                        .put(`/account/payment/${paymentId}`)
                        .send(cardPut)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.payment).toBeDefined();
                    expect(res.body.payment.id).toEqual(paymentId);
                    expect(res.body.payment.user_id).toEqual(userId);
                    expect(res.body.payment.card_no).toEqual(cardPost.card_no);
                    expect(res.body.payment.provider).toEqual(cardPut.provider);
                })
            }), 

            describe('Extra input field', () => {

                it ('Should ignore extra field and update payment', async () => {
                    const res = await request(app)
                        .put(`/account/payment/${paymentId}`)
                        .send({ ...cardPut, telephone: 1234567890 })
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.payment).toBeDefined();
                    expect(res.body.payment.id).toEqual(paymentId);
                    expect(res.body.payment.user_id).toEqual(userId);
                    expect(res.body.payment.card_no).toEqual(cardPost.card_no);
                    expect(res.body.payment.provider).toEqual(cardPut.provider);
                    expect(res.body.payment.telephone).not.toBeDefined();
                })
            }), 

            describe('Invalid formatted inputs', () => {

                it ('Should not update', async () => {
                    const res = await request(app)
                        .put(`/account/payment/${paymentId}`)
                        .send(invalidCardPut)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.payment).toBeDefined();
                    expect(res.body.payment.id).toEqual(paymentId);
                    expect(res.body.payment.user_id).toEqual(userId);
                    expect(res.body.payment.card_no).toEqual(cardPost.card_no);
                    expect(res.body.payment.provider).toEqual(cardPut.provider);
                    expect(res.body.payment.cvv).toEqual(cardPost.cvv);
                    expect(res.body.payment.cvv).not.toEqual(invalidCardPut.cvv);
                })
            }),

            describe('Invalid user_id for the payment', () => {

                it ('Should return a 409 error', (done) => {
                    request(app)
                        .put(`/account/payment/${differentPaymentId}`)
                        .send(cardPut)
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
                    .put(`/account/payment/${paymentId}`)
                    .send(cardPut)
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

    describe('DELETE \'/account/payment/payment_id\'', () => {
        
        describe('Valid token', () => {

            describe('Valid user_id', () => {

                describe('Payment is primary payment method', () => {

                    it ('Should delete and return the payment', async () => {
                        // update payment to be user's primary payment
                        var user = await User.findByEmail(testLogin.email);
                        await User.update({ ...user, primary_payment_id: paymentId });

                        const res = await request(app)
                            .delete(`/account/payment/${paymentId}`)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.payment).toBeDefined();
                        expect(res.body.payment.id).toEqual(paymentId);
                        expect(res.body.payment.user_id).toEqual(userId);
                        expect(res.body.payment.card_no).toEqual(cardPost.card_no);
                        expect(res.body.payment.provider).toEqual(cardPut.provider);

                        // verify that primary_payment_id has been reset to null
                        user = await User.findByEmail(testLogin.email);
                        expect(user.primary_payment_id).toEqual(null);
                    })
                })
            }), 

            describe('Invalid user_id for the payment', () => {

                it ('Should return a 409 error', (done) => {
                    request(app)
                        .delete(`/account/payment/${differentPaymentId}`)
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
                    .delete(`/account/payment/${paymentId}`)
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