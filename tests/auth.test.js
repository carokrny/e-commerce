const app = require('../app');
const session = require('supertest-session');
const { loginUser, 
    createCSRFToken, 
    createCartItem } = require('./testUtils');
const { user1 } = require('./testData').users;
const { testRegister, 
    product,
    xssAttack } = require('./testData');
const User = require('../models/UserModel');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');

describe('Auth endpoints', () => {

    let testSession;
    let csrfToken;

    beforeEach(async () => {
        // create a test session for saving functional cookies
        testSession = session(app);

        try {
            // create csrfToken
            csrfToken = await createCSRFToken(testSession);
        } catch(e) {
            console.log(e);
        }
    })
        
    describe('GET \'/register\'', () => {

        it('should return registration page', async () => {
            const res = await testSession
                .get('/register')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            })
    })

    describe ('POST \'/register\'', () => {
        
        describe('Email and password entered', () => {

            afterEach(async () => {
                try {
                    // delete the test registration after tests run 
                    await User.deleteByEmail(testRegister.email);
                } catch(e) {
                    console.log(e);
                }
            })

            it ('should successfully register and attach JWT', async () => {
                const res = await testSession
                    .post('/register')
                    .send(testRegister)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toEqual(testRegister.email);
                expect(res.body.token).toBeDefined();
            })
        })

        describe('XSS attack on email field', () => {

            it ('Should be return 400 because XSS attack is not email format', (done) => {
                testSession
                    .post('/register')
                    .send({ ...testRegister,
                        email: xssAttack })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('XSS attack on password field', () => {

            it ('should successfully register because XSS does not meet strong PW requirements', (done) => {
                testSession
                    .post('/register')
                    .send({ ...testRegister,
                        password: xssAttack })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('Email already in use', () => {
            
            it('should return a 409 error', (done) => {
                testSession
                    .post('/register')
                    .send({ email: user1.email, password: testRegister.password})
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(409)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('Email and/or password missing', () => {
            
            it('should return a 400 error', (done) => {
                testSession
                    .post('/register')
                    .send({ email: null, password: null })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('Cart with registration', () => {

            let cartId;

            afterEach(async () => {
                try {
                    // delete cart if it exists
                    if (cartId) {
                        await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                        await Cart.delete(cartId);
                        cartId = null;
                    }

                    // delete user from db 
                    await User.deleteByEmail(testRegister.email);
                } catch(e) {
                    console.log(e)
                }
            })

            describe('Existing cart before registration', () => {

                beforeEach(async () => {
                    try {
                        // add item to cart
                        cartId = await createCartItem(product, testSession, csrfToken);
                    } catch(e) {
                        console.log(e);
                    }
                })

                it('should assign newly registered user_id to existing cart', async () => {
                    // register user account
                    const res1 = await testSession
                        .post('/register')
                        .send(testRegister)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(testRegister.email);
                    expect(res1.body.cart).toBeDefined();
                    expect(res1.body.cart.id).toEqual(cartId);
                    expect(res1.body.cartItems).toBeDefined();
                    expect(res1.body.cartItems[0].product_id).toEqual(product.product_id);
                    expect(res1.body.cartItems[0].quantity).toEqual(product.quantity);
                })
            })

            describe ('No existing cart before registration', () => {

                it ('Should create a new user, and GET /cart should return a 404 error' , async () => {
                    // register user account
                    const res1 = await testSession
                        .post('/register')
                        .send(testRegister)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect('Content-Type', /json/)
                        .expect(201);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(testRegister.email);
                    expect(res1.body.token).toBeDefined();
                    expect(res1.body.cart).toBeDefined();
                    expect(res1.body.cart).toEqual(null);
                    expect(res1.body.cartItems).toBeDefined();
                    expect(res1.body.cartItems).toEqual([]);
                    

                    // read cart
                    const res2 = await testSession
                        .get(`/cart`)
                        .set('Accept', 'application/json')
                        .expect(404);
                })
            })
        })
    })

    describe ('GET \'/login\'', () => {

        it ('should return login page', async () => {
            const res = await testSession
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
                const res = await testSession
                    .post('/login')
                    .send(user1)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.user).toBeDefined();
                expect(res.body.user.email).toEqual(user1.email);
                expect(res.body.user.id).toEqual(user1.id);
                expect(res.body.token).toBeDefined();
            })
        })

        describe ('email and password entered, but password incorrect', () => {

            it ('should return a 401 error', (done) => {
                testSession
                    .post('/login')
                    .send({ email: user1.email, password: 'wrongPassw0rd' })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe ('email and password entered, but email incorrect', () => {

            it ('should return a 401 error', (done) => {
                testSession
                    .post('/login')
                    .send({ email: 'wrong@me.com', password: user1.password })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe ('email and/or password missing', () => {

            it('should return a 400 error', (done) => {
                testSession
                    .post('/login')
                    .send({ email: null, password: null })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('Cart with login', () => {

            let cartId;

            afterEach(async () => {
                try {
                    if (cartId) {
                        await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                        await Cart.delete(cartId);
                        cartId = null;
                    }
                } catch(e) {
                    console.log(e);
                }
            })

            describe('Existing cart before login that is not associated with a user_id', () => {

                beforeEach(async () => {
                    try {
                        // add item to cart
                        cartId = await createCartItem(product, testSession, csrfToken);
                    } catch(e) {
                        console.log(e);
                    }
                })

                it('Should assign logged in user_id to existing cart', async () => {
                        
                    // log into user account
                    const res1 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(user1.email);
                    expect(res1.body.user.id).toEqual(user1.id);
                    expect(res1.body.token).toBeDefined();
                    expect(res1.body.cart).toBeDefined();
                    expect(res1.body.cart.id).toEqual(cartId);
                    expect(res1.body.cartItems).toBeDefined();
                    expect(res1.body.cartItems[0].product_id).toEqual(product.product_id);
                    expect(res1.body.cartItems[0].quantity).toEqual(product.quantity);
                })
            })

            describe('User has cart from previous session', () => {

                beforeEach(async () => {
                    // --- previous session ---

                    try {
                        // log user in
                        await loginUser(user1, testSession, csrfToken);

                        // add item to cart
                        cartId = await createCartItem(product, testSession, csrfToken);
                    } catch(e) {
                        console.log(e);
                    }

                    // --- new session ---

                    try {
                        // create a new test session for saving functional cookies
                        testSession = session(app);

                        // create csrfToken
                        csrfToken = await createCSRFToken(testSession);
                    } catch(e) {
                        console.log(e);
                    }
                })

                it('User logs in, should find cart from last session', async () => {    
                    // log into user account
                    const res1 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(user1.email);
                    expect(res1.body.user.id).toEqual(user1.id);
                    expect(res1.body.token).toBeDefined();
                    expect(res1.body.cart).toBeDefined();
                    expect(res1.body.cart.id).toEqual(cartId);
                    expect(res1.body.cartItems[0].quantity).toEqual(product.quantity);
                })

                it('User creates new cart before logging in, should consolidate carts', async () => {    
                    // create new cart
                    const res1 = await testSession
                        .post('/cart')
                        .set('Authorization', null)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken);
                    const newCart = res1.body.cart;
                    cartId = newCart.id;

                    // add same item to new session cart
                    const res2 = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Authorization', null)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken);

                    // log into user account
                    const res3 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res3.body).toBeDefined();
                    expect(res3.body.user).toBeDefined();
                    expect(res3.body.user.email).toEqual(user1.email);
                    expect(res3.body.user.id).toEqual(user1.id);
                    expect(res3.body.token).toBeDefined();
                    expect(res3.body.cart).toBeDefined();
                    expect(res3.body.cart.id).toEqual(cartId);
                    expect(res3.body.cartItems[0].quantity).toEqual(product.quantity * 2);
                })
            })

            describe ('No existing cart before login', () => {

                it ('Should log in, and GET /cart should return a 404 error' , async () => {
                    // log into user account
                    const res1 = await testSession
                        .post('/login')
                        .send(user1)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect('Content-Type', /json/)
                        .expect(200);
                    expect(res1.body).toBeDefined();
                    expect(res1.body.user).toBeDefined();
                    expect(res1.body.user.email).toEqual(user1.email);
                    expect(res1.body.user.id).toEqual(user1.id);
                    expect(res1.body.token).toBeDefined();
                    expect(res1.body.cart).toBeDefined();
                    expect(res1.body.cart).toEqual(null);
                    expect(res1.body.cartItems).toBeDefined();
                    expect(res1.body.cartItems).toEqual([]);
                    

                    // read cart
                    const res2 = await testSession
                        .get(`/cart`)
                        .set('Accept', 'application/json')
                        .expect(404);
                })
            })
        })
    })

    describe ('POST \'/logout\'', () => {

        beforeEach(async () => {
            try{
                await loginUser(user1, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        it ('should log out', async () => {
            const res = await testSession
                .post('/logout')
                .set('Accept', 'application/json')
                .set(`XSRF-TOKEN`, csrfToken)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body).toBeDefined();
            expect(res.body.token).not.toBeDefined();
        })
    })
});
