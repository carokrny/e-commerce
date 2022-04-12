const app = require('../app');
const request = require('supertest');
const { user1 } = require('./testData').users;
const { cardPost, 
        cardPut,
        invalidCardPost, 
        invalidCardPut,
        differentPaymentId } = require('./testData');
const User = require('../models/UserModel');
const Card = require('../models/CardModel');

describe ('Account payment method endpoints', () => {

    describe('Valid JWT', () => {

        let token;
        let paymentId;

        beforeAll(async () => {
            const res = await request(app)
                .post('/login')
                .send(user1);
            token = res.body.token;
        }),

        afterAll(async () => {
            // tear down 
            if(paymentId) {
                try {
                    await Card.delete(paymentId);
                } catch(e) {}
            }
        }),

        describe('POST \'/account/payment\'', () => {

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
                    expect(res.body.payment.user_id).toEqual(user1.id);
                    expect(res.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));
                    expect(res.body.payment.is_primary_payment).toEqual(cardPost.is_primary_payment);
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

        describe('GET \'/account/payment/payment_id\'', () => {

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
                    expect(res.body.payment.user_id).toEqual(user1.id);
                    expect(res.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));
                    expect(res.body.payment.is_primary_payment).toEqual(cardPost.is_primary_payment);
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

        describe('GET \'/account/payment/all\'', () => {

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
                expect(res.body.payments[0].user_id).toEqual(user1.id);
            })
        }), 

        describe('PUT \'/account/payment/payment_id\'', () => {

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
                    expect(res.body.payment.user_id).toEqual(user1.id);
                    expect(res.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));
                    expect(res.body.payment.provider).toEqual(cardPut.provider);
                    expect(res.body.payment.is_primary_payment).toEqual(cardPut.is_primary_payment);
                    expect(res.body.payment.is_primary_payment).not.toEqual(cardPost.is_primary_payment);
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
                    expect(res.body.payment.user_id).toEqual(user1.id);
                    expect(res.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));
                    expect(res.body.payment.provider).toEqual(cardPut.provider);
                    expect(res.body.payment.is_primary_payment).toEqual(cardPut.is_primary_payment);
                    expect(res.body.payment.telephone).not.toBeDefined();
                })
            }), 

            describe('Invalid formatted inputs', () => {

                it ('Should not update with 400 error', (done) => {
                    request(app)
                        .put(`/account/payment/${paymentId}`)
                        .send(invalidCardPut)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
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

        describe('DELETE \'/account/payment/payment_id\'', () => {

            describe('Valid user_id', () => {

                describe('Payment is primary payment method', () => {

                    it ('Should delete and return the payment', async () => {
                        const res = await request(app)
                            .delete(`/account/payment/${paymentId}`)
                            .set('Authorization', token)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.payment).toBeDefined();
                        expect(res.body.payment.id).toEqual(paymentId);
                        expect(res.body.payment.user_id).toEqual(user1.id);
                        expect(res.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));
                        expect(res.body.payment.provider).toEqual(cardPut.provider);
                        expect(res.body.payment.is_primary_payment).toEqual(cardPut.is_primary_payment);

                        // verify that primary_payment_id has been reset to null
                        testUser = await User.findByEmail(user1.email);
                        expect(testUser.primary_payment_id).toEqual(null);
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
        })
    }),

    describe('Invalid JWT', () => {

        let paymentId;

        describe('POST \'/account/payment\'', () => {

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
        }), 

        describe('GET \'/account/payment/payment_id\'', () => {

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
        }), 

        describe('GET \'/account/payment/all\'', () => {

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
        }), 

        describe('PUT \'/account/payment/payment_id\'', () => {

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
        }),

        describe('DELETE \'/account/payment/payment_id\'', () => {

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