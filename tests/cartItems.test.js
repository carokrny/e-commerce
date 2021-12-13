const app = require('../app');
const request = require('supertest');
const { testLogin2, product, updatedProduct } = require('./testData');
const CartModel = require('../models/CartModel');
const UserModel = require('../models/UserModel');
const Cart = new CartModel();
const User = new UserModel();

describe ('Cart endpoints', () => {

    var token;
    var cartId_token;
    var cartId_noToken;

    beforeAll(async () => {
        // create JWT for authentication 
        const res = await request(app)
            .post('/login')
            .send(testLogin2);
        token = res.body.token;

        // create a cart for cart_item endpoints with a token
        const res2 = await request(app)
            .post('/cart')
            .set('Authorization', token)
            .set('Accept', 'application/json');
        cartId_token = res2.body.cart.id;

        // create a cart for cart_item endpoints without a token
        const res3 = await request(app)
            .post('/cart')
            .set('Authorization', null)
            .set('Accept', 'application/json');
        cartId_noToken = res3.body.cart.id;
    }),

    afterAll(async () => {
        if(cartId_token) {
            // delete cart
            await Cart.delete(cartId_token);
        }

        if(cartId_noToken) {
            // delete cart
            await Cart.delete(cartId_noToken);
        }
    }),

    describe('POST \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {
            it('Should return the cart item', async () => {
                const res = await request(app)
                    .post(`/cart/${cartId_token}/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
            })
        }), 

        describe('Invalid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .post(`/cart/${cartId_noToken}/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
            })
        })
    }),

    describe('GET \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .get(`/cart/${cartId_token}/item/${product.product_id}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
            })
        }), 

        describe('Valid token, incorrect product_id', () => {

            it ('Should return 404 error', (done) => {
                request(app)
                    .get(`/cart/${cartId_token}/item/7`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        })

        describe('Invalid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .get(`/cart/${cartId_noToken}/item/${product.product_id}`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
            })
        })
    }),

    describe('PUT \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .put(`/cart/${cartId_token}/item/${product.product_id}`)
                    .send(updatedProduct)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
            })
        }), 

        describe('Valid token, incorrect product_id', () => {

            it ('Should return 404 error', (done) => {
                request(app)
                    .put(`/cart/${cartId_token}/item/7`)
                    .send(updatedProduct)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }),

        describe('Invalid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .put(`/cart/${cartId_noToken}/item/${product.product_id}`)
                    .send(updatedProduct)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
            })
        })
    }),

    describe('DELETE \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .delete(`/cart/${cartId_token}/item/${product.product_id}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
            })
        }), 

        describe('Valid token, incorrect product_id', () => {

            it ('Should return 404 error', (done) => {
                request(app)
                    .delete(`/cart/${cartId_token}/item/${product.product_id}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })
        }),

        describe('Invalid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .delete(`/cart/${cartId_noToken}/item/${product.product_id}`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
            })
        })
    })
})
