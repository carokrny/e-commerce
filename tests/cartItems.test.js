const app = require('../app');
const request = require('supertest');
const { testLogin2, product, updatedProduct } = require('./testData');
const CartModel = require('../models/CartModel');
const UserModel = require('../models/UserModel');
const Cart = new CartModel();
const User = new UserModel();

describe ('Cart endpoints', () => {

    var token;
    var cartId;

    beforeAll(async () => {
        // create JWT for authentication 
        const res = await request(app)
            .post('/login')
            .send(testLogin2);
        token = res.body.token;

        // create a cart for cart_item endpoints 
        const res2 = await request(app)
            .post('/cart')
            .set('Authorization', token)
            .set('Accept', 'application/json');
        cartId = res2.body.cart.id;
    }),

    afterAll(async () => {
        if(cartId) {
            // delete cart
            await Cart.delete(cartId);
        }
    }),

    describe('POST \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {
            it('Should return the cart item', async () => {
                const res = await request(app)
                    .post(`/cart/${cartId}/item/${product.product_id}`)
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

            it ('Should return 401 error', (done) => {
                request(app)
                    .post(`/cart/${cartId}/item/${product.product_id}`)
                    .send(product)
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

    describe('GET \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .get(`/cart/${cartId}/item/${product.product_id}`)
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
                    .get(`/cart/${cartId}/item/7`)
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

            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/cart/${cartId}/item/${product.product_id}`)
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

    describe('PUT \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .put(`/cart/${cartId}/item/${product.product_id}`)
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
                    .put(`/cart/${cartId}/item/7`)
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

            it ('Should return 401 error', (done) => {
                request(app)
                    .put(`/cart/${cartId}/item/${product.product_id}`)
                    .send(updatedProduct)
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

    describe('DELETE \'/cart/:cart_id/item/:product_id\'', () => {

        describe('Valid token', () => {

            it('Should return the cart item', async () => {
                const res = await request(app)
                    .delete(`/cart/${cartId}/item/${product.product_id}`)
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
                    .delete(`/cart/${cartId}/item/${product.product_id}`)
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

            it ('Should return 401 error', (done) => {
                request(app)
                    .delete(`/cart/${cartId}/item/${product.product_id}`)
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
