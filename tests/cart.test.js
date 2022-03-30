const app = require('../app');
const request = require('supertest');
const session = require('supertest-session');
const { user1 } = require('./testData').users;
const { product } = require('./testData');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');


describe ('Cart endpoints', () => {

    describe('Valid JWT', () => {

        let token;
        let cartId;
        let testSession;

        beforeAll(async () => {
            // create JWT for authentication 
            const res = await request(app)
                .post('/login')
                .send(user1);
            token = res.body.token;

            testSession = session(app);
        }),

        afterAll(async() => {
            if(cartId) {
                // delete cart item
                await CartItem.delete({ cart_id: cartId, product_id: product.product_id });

                // delete cart
                await Cart.delete(cartId);
            }
        }),

        describe('POST \'/cart\'', () => {

            it ('Should create a new cart', async () => {
                const res = await testSession
                    .post('/cart')
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toBeDefined();
                cartId = res.body.cart.id;
            }) 
        }),

        describe('GET \'/cart\'', () => {

            describe('Empty cart', () => {

                it('Should throw a 404 error', async () => {
                    const res = await testSession
                        .get(`/cart`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(404);
                })
            }), 

            describe('Item in cart', () => {

                beforeEach(async () => {
                    const res = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Authorization', token)
                        .set('Accept', 'application/json');
                }),

                it('Should return the cart and cart item(s)', async () => {
                    const res = await testSession
                            .get(`/cart`)
                            .set('Authorization', token)
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

    describe('Invalid JWT', () => {

        let cartId;
        let testSession;

        beforeAll(async () => {
            testSession = session(app);
        }),
        
        afterAll(async() => {
            if(cartId) {
                // delete cart item
                await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                
                // delete cart
                await Cart.delete(cartId);
            }
        }),

        describe('POST \'/cart\'', () => {

            it ('Should create a new cart', async () => {
                const res = await testSession
                    .post('/cart')
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toBeDefined();
                cartId = res.body.cart.id;
            })
        }),

        describe('GET \'/cart\'', () => {

            describe('Empty cart', () => {

                it('Should throw a 404 error', async () => {
                    const res = await testSession
                        .get(`/cart`)
                        .set('Authorization', null)
                        .set('Accept', 'application/json')
                        .expect(404);
                })
            }), 

            describe('Item in cart', () => {

                beforeEach(async () => {
                    const res = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Authorization', null)
                        .set('Accept', 'application/json');
                }),

                it('Should return the cart and cart item(s)', async () => {
                    const res = await testSession
                            .get(`/cart`)
                            .set('Authorization', null)
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