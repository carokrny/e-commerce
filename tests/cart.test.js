const app = require('../app');
const session = require('supertest-session');
const { loginUser,
    createCSRFToken, 
    createCartItem } = require('./testUtils');
const { user1 } = require('./testData').users;
const { product } = require('./testData');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');


describe ('Cart endpoints', () => {

    describe('Valid auth', () => {
        let cartId;
        let testSession;
        let csrfToken;

        beforeAll(async () => {
            // create test session
            testSession = session(app);
            
            try {
                // create csrfToken
                csrfToken = await createCSRFToken(testSession);

                // log user in
                token = await loginUser(user1, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        afterAll(async() => {
            try {
                if(cartId) {
                    // delete cart item
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });

                    // delete cart
                    await Cart.delete(cartId);
                }
            } catch(e) {
                console.log(e);
            }
        })

        describe('POST \'/cart\'', () => {

            it ('Should create a new cart', async () => {
                const res = await testSession
                    .post('/cart')
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toBeDefined();
                cartId = res.body.cart.id;
            }) 
        })

        describe('GET \'/cart\'', () => {

            describe('Empty cart', () => {

                it('Should throw a 404 error', async () => {
                    const res = await testSession
                        .get(`/cart`)
                        .set('Accept', 'application/json')
                        .expect(404);
                })
            }) 

            describe('Item in cart', () => {

                beforeEach(async () => {
                    // add item to cart
                    await createCartItem(product, testSession, csrfToken);
                })

                it('Should return the cart and cart item(s)', async () => {
                    const res = await testSession
                            .get(`/cart`)
                            .set('Accept', 'application/json')
                            .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.cart).toBeDefined();
                    expect(res.body.cart.id).toEqual(cartId);
                    expect(res.body.cartItems).toBeDefined();
                    expect(res.body.cartItems[0]).toBeDefined();
                    expect(res.body.cartItems[0].product_id).toEqual(product.product_id);
                })
            })
        })
    })

    describe('Invalid auth', () => {

        let cartId;
        let testSession;
        let csrfToken

        beforeAll(async () => {
            testSession = session(app);

            try {
                // create csrfToken
                csrfToken = await createCSRFToken(testSession);
            } catch(e) {
                console.log(e);
            }
        })
        
        afterAll(async() => {
            try {
                if(cartId) {
                    // delete cart item
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                    
                    // delete cart
                    await Cart.delete(cartId);
                }
            } catch(e) {
                console.log(e);
            }
        })

        describe('POST \'/cart\'', () => {

            it ('Should create a new cart', async () => {
                const res = await testSession
                    .post('/cart')
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toBeDefined();
                cartId = res.body.cart.id;
            })
        })

        describe('GET \'/cart\'', () => {

            describe('Empty cart', () => {

                it('Should throw a 404 error', async () => {
                    const res = await testSession
                        .get(`/cart`)
                        .set('Accept', 'application/json')
                        .expect(404);
                })
            }) 

            describe('Item in cart', () => {

                beforeEach(async () => {
                    // add item to cart
                    await createCartItem(product, testSession, csrfToken);
                })

                it('Should return the cart and cart item(s)', async () => {
                    const res = await testSession
                            .get(`/cart`)
                            .set('Accept', 'application/json')
                            .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.cart).toBeDefined();
                    expect(res.body.cart.id).toEqual(cartId);
                    expect(res.body.cartItems).toBeDefined();
                    expect(res.body.cartItems[0]).toBeDefined();
                    expect(res.body.cartItems[0].product_id).toEqual(product.product_id);
                })
            })
        })
    })
})