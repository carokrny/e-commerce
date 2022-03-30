const app = require('../app');
const request = require('supertest');
const session = require('supertest-session');
const { user1 } = require('./testData').users;
const { testRegister, product } = require('./testData');
const User = require('../models/UserModel');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');

describe('Auth endpoints', () => {
        
    describe('GET \'/register\'', () => {

        it('should return registration page', async () => {
            const res = await request(app)
                .get('/register')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            })
    }),

    describe ('POST \'/register\'', () => {
        
        describe('Email and password entered', () => {

            afterEach(async () => {
                // delete the test registration after tests run 
                await User.deleteByEmail(testRegister.email);
            })

            it ('should successfully register and attach JWT', async () => {
                const res = await request(app)
                    .post('/register')
                    .send(testRegister)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toEqual(testRegister.email);
                expect(res.body.token).toBeDefined();
            })
        }), 

        describe('Email already in use', () => {
            
            it('should return a 409 error', (done) => {
                request(app)
                    .post('/register')
                    .send({ email: user1.email, password: testRegister.password})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(409)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }),

        describe('Email and/or password missing', () => {
            
            it('should return a 400 error', (done) => {
                request(app)
                    .post('/register')
                    .send({ email: null, password: null })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }),

        describe('Cart with registration', () => {

            let testSession;
            let cartId;

            beforeEach(async () => {
                testSession = session(app);
            }),

            afterEach(async () => {
                if (cartId) {
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                    await Cart.delete(cartId);
                    cartId = null;
                }
                await User.deleteByEmail(testRegister.email);
            }),

            describe('Existing cart before registration', () => {

                it('should assign newly registered user_id to existing cart', async () => {
                    // create cart
                    const res1 = await testSession
                        .post('/cart')
                        .set('Authorization', null)
                        .set('Accept', 'application/json');
                    cartId = res1.body.cart.id;

                    // add item to cart 
                    const res2 = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Authorization', null)
                        .set('Accept', 'application/json');

                    // register user account
                    const res3 = await testSession
                        .post('/register')
                        .send(testRegister)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res3.body).toBeDefined();
                    expect(res3.body.user).toBeDefined();
                    expect(res3.body.user.email).toEqual(testRegister.email);
                    expect(res3.body.token).toBeDefined();
                    const token = res3.body.token;

                    // read cart
                    const res4 = await testSession
                        .get(`/cart`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(200);
                    expect(res4.body).toBeDefined();
                    expect(res4.body.cart).toBeDefined();
                    expect(res4.body.cart.id).toEqual(cartId);
                })
            }), 

            describe ('No existing cart before registration', () => {

                it ('Should create a new user, and GET /cart should return a 400 error' , async () => {
                    // register user account
                    const res1 = await testSession
                        .post('/register')
                        .send(testRegister)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(testRegister.email);
                    expect(res1.body.token).toBeDefined();
                    const token = res1.body.token;

                    // read cart
                    const res2 = await testSession
                        .get(`/cart`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(400);
                })
            })
        })
    }),

    describe ('GET \'/login\'', () => {

        it ('should return login page', async () => {
            const res = await request(app)
                .get('/login')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
        })
    })

    describe ('POST \'/login\'', () => {
        
        describe ('correct email and password entered', () => {
            
            it ('should return user and attach a JWT', async () => {
                const res = await request(app)
                    .post('/login')
                    .send(user1)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toEqual(user1.email);
                expect(res.body.user.id).toEqual(user1.id);
                expect(res.body.token).toBeDefined();
            })
        }),

        describe ('email and password entered, but password incorrect', () => {

            it ('should return a 401 error', (done) => {
                request(app)
                    .post('/login')
                    .send({ email: user1.email, password: 'wrongPassword' })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }), 

        describe ('email and password entered, but email incorrect', () => {

            it ('should return a 401 error', (done) => {
                request(app)
                    .post('/login')
                    .send({ email: 'wrong@me.com', password: user1.password })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }), 

        describe ('email and/or password missing', () => {

            it('should return a 400 error', (done) => {
                request(app)
                    .post('/login')
                    .send({ email: null, password: null })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }), 

        describe('Cart with login', () => {

            let testSession;
            let cartId;

            beforeEach(async () => {
                testSession = session(app);
            }),

            afterEach(async () => {
                if (cartId) {
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                    await Cart.delete(cartId);
                    cartId = null;
                }
            }),

            describe('Existing cart before login, user has no cart from previous session', () => {

                it('Should assign logged in user_id to existing cart', async () => {
                    // create cart
                    const res1 = await testSession
                        .post('/cart')
                        .set('Authorization', null)
                        .set('Accept', 'application/json');
                    cartId = res1.body.cart.id;

                    // add item to cart 
                    const res2 = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Authorization', null)
                        .set('Accept', 'application/json');

                    // log into user account
                    const res3 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res3.body).toBeDefined();
                    expect(res3.body.user).toBeDefined();
                    expect(res3.body.user.email).toEqual(user1.email);
                    expect(res3.body.user.id).toEqual(user1.id);
                    expect(res3.body.token).toBeDefined();
                    const token = res3.body.token;

                    // read cart
                    const res4 = await testSession
                        .get(`/cart`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(200);
                    expect(res4.body).toBeDefined();
                    expect(res4.body.cart).toBeDefined();
                    expect(res4.body.cart.id).toEqual(cartId);
                })
            }),

            describe('Existing cart before login, user has cart from previous session', () => {

                it('Should consolidate carts', async () => {
                    // create cart in database, from previous session
                    const oldCart = await Cart.create(user1.id);

                    // add item to cart from previous session
                    await CartItem.create({ ...product, cart_id: oldCart.id });

                    // --- new session ---
                    
                    // create new cart
                    const res1 = await testSession
                        .post('/cart')
                        .set('Authorization', null)
                        .set('Accept', 'application/json');
                    const newCart = res1.body.cart;
                    cartId = newCart.id;

                    // add same item to new session cart
                    await CartItem.create({ ...product, cart_id: newCart.id });

                    // log into user account
                    const res2 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res2.body).toBeDefined();
                    expect(res2.body.user).toBeDefined();
                    expect(res2.body.user.email).toEqual(user1.email);
                    expect(res2.body.user.id).toEqual(user1.id);
                    expect(res2.body.token).toBeDefined();
                    const token = res2.body.token;

                    // read cart
                    const res3 = await testSession
                        .get(`/cart`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(200);
                    expect(res3.body).toBeDefined();
                    expect(res3.body.cart).toBeDefined();
                    expect(res3.body.cart.id).toEqual(cartId);
                    expect(res3.body.cartItems[0].quantity).toEqual(product.quantity * 2);

                })
            }), 

            describe ('No existing cart before login', () => {

                it ('Should log in, and GET /cart should return a 400 error' , async () => {
                    // log into user account
                    const res1 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(user1.email);
                    expect(res1.body.user.id).toEqual(user1.id);
                    expect(res1.body.token).toBeDefined();
                    const token = res1.body.token;

                    // read cart
                    const res2 = await testSession
                        .get(`/cart`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(400);
                })
            })
        })
    })

    describe ('POST \'/logout\'', () => {

        let token; 

        beforeEach(async () => {
            const res = await request(app)
                    .post('/login')
                    .send(user1);
            token = res.body.token;
        })
        
        it ('should log out', async () => {
            const res = await request(app)
                .post('/logout')
                .set('Authorization', token)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            expect(res.body.token).not.toBeDefined();
        })
    })
});
