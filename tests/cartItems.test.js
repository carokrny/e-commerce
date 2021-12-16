const app = require('../app');
const request = require('supertest');
const session = require('supertest-session');
const { testLogin2, product, updatedProduct } = require('./testData');
const CartModel = require('../models/CartModel');
const CartItemModel = require('../models/CartItemModel');
const Cart = new CartModel();
const CartItem = new CartItemModel();

describe ('Cart endpoints', () => {

    describe('Valid JWT', () => {

        var token;
        var cartId;
        var testSession;

        beforeAll(async () => {
            // create JWT for authentication 
            const res = await request(app)
                .post('/login')
                .send(testLogin2);
            token = res.body.token;

            testSession = session(app);

            const res2 = await testSession
                    .post('/cart')
                    .set('Authorization', token)
                    .set('Accept', 'application/json');
            cartId = res2.body.cart.id;
        }),

        afterAll(async () => {
            if (cartId) {
                await Cart.delete(cartId);
            }
        }),

        describe('POST \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            })
        })

        describe('GET \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .get(`/cart/item/${product.product_id}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            }),
                
            describe('Incorrect product_id', () => {

                it ('Should return 404 error', (done) => {
                    testSession
                        .get(`/cart/item/7`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(404)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        }),

        describe('PUT \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .put(`/cart/item/${product.product_id}`)
                    .send(updatedProduct)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
                expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
            }),

            describe('Incorrect product_id', () => {

                it ('Should return 404 error', (done) => {
                    testSession
                        .put(`/cart/item/7`)
                        .send(updatedProduct)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(404)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        }),

        describe('DELETE \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .delete(`/cart/item/${product.product_id}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            })

            describe('Incorrect product_id', () => {

                it ('Should return 404 error', (done) => {
                    testSession
                        .delete(`/cart/item/${product.product_id}`)
                        .set('Authorization', token)
                        .set('Accept', 'application/json')
                        .expect(404)
                        .end((err, res) => {
                            if (err) return done(err);
                            return done();
                        });
                })
            })
        })
    })

    describe('Invalid JWT', () => {

        var testSession;
        var cartId;

        beforeAll(async () => {
            testSession = session(app);

            const res = await testSession
                    .post('/cart')
                    .set('Authorization', null)
                    .set('Accept', 'application/json');
            cartId = res.body.cart.id;
        }),

        afterAll(async () => {
            if (cartId) {
                await Cart.delete(cartId);
            }
        }),

        describe('POST \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            })
        }),

        describe('GET \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .get(`/cart/item/${product.product_id}`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            })
        }),

        describe('PUT \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .put(`/cart/item/${product.product_id}`)
                    .send(updatedProduct)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
                expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
            })
        }),

        describe('DELETE \'/cart/item/:product_id\'', () => {
            
            it('Should return the cart item', async () => {
                const res = await testSession
                    .delete(`/cart/item/${product.product_id}`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            })
        })
    })
})
