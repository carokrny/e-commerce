const app = require('../app');
const request = require('supertest');
const session = require('supertest-session');
const { testLogin, userId, product } = require('./testData');
const Order = require('../models/OrderModel');
const OrderItem = require('../models/OrderItemModel');
const CartItem = require('../models/CartItemModel');

describe ('Cart endpoints', () => {

    var cartId;

    describe('Valid JWT', () => {

        var token;
        var newOrderId;
        var testSession;

        beforeAll(async () => {
            // create JWT for authentication 
            const res = await request(app)
                .post('/login')
                .send(testLogin);
            token = res.body.token;

            testSession = session(app);
        }),

        afterAll(async() => {
            if(newOrderId) {
                // delete order_item created by checkout test
                await OrderItem.delete({ order_id: newOrderId, product_id: product.product_id });

                // delete order created by checkout test
                await Order.delete(newOrderId);
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

            it ('Should get the cart', async () => {
                const res = await testSession
                    .get(`/cart`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toEqual(cartId);
            })
        }),

        describe('POST \'/cart/checkout\'', () => {

            it ('Should reject an empty cart with 404 error', (done) => {
                testSession
                    .post(`/cart/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            }),

            it ('Should create a new order', async () => {
                // add a product to cart to avoid empty cart error 
                await CartItem.create({ ...product, cart_id: cartId });
                const res = await testSession
                    .post(`/cart/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                newOrderId = res.body.order.id;
                cartId = null;
            })
        })
    })

    describe('Invalid JWT', () => {

        var newOrderId;
        var testSession;

        beforeAll(async () => {
            testSession = session(app);
        }),
        
        afterAll(async() => {
            if(newOrderId) {
                // delete order_item created by checkout test
                await OrderItem.delete({ order_id: newOrderId, product_id: product.product_id });

                // delete order created by checkout test
                await Order.delete(newOrderId);
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
                            
            it ('Should get the cart', async () => {
                const res = await testSession
                        .get(`/cart`)
                        .set('Authorization', null)
                        .set('Accept', 'application/json')
                        .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toEqual(cartId);
            })
        }),

        describe('POST \'/cart/checkout\'', () => {

            it ('Should reject an empty cart with 404 error', (done) => {
                testSession
                    .post(`/cart/checkout`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            }),

            it ('Should create a new order', async () => {
                // add a product to cart to avoid empty cart error 
                await CartItem.create({ ...product, cart_id: cartId });
                const res = await testSession
                    .post(`/cart/checkout`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                newOrderId = res.body.order.id;
                cartId = null;
            })
        })
    })
})