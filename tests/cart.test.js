const app = require('../app');
const request = require('supertest');
const { testLogin, userId, product } = require('./testData');
const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const CartItemModel = require('../models/CartItemModel');
const Order = new OrderModel();
const OrderItem = new OrderItemModel();
const CartItem = new CartItemModel();

describe ('Cart endpoints', () => {

    var token;

    var newCartId;
    var newOrderId;

    beforeAll(async () => {
        // create JWT for authentication 
        const res = await request(app)
            .post('/login')
            .send(testLogin);
        token = res.body.token;
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

        describe('Valid token', () => {

            it ('Should create a new cart', async () => {
                const res = await request(app)
                    .post('/cart')
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                newCartId = res.body.cart.id;
            });
        }), 

        describe('Invalid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .post('/cart')
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

    describe('GET \'/cart/cart_id\'', () => {

        describe('Valid token', () => {

            it ('Should get the cart', async () => {
                const res = await request(app)
                    .get(`/cart/${newCartId}`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.cart).toBeDefined();
                expect(res.body.cart.id).toEqual(newCartId);
            })
        }), 

        describe('Invalid token', () => {
            
            it ('Should return 401 error', (done) => {
                request(app)
                    .get(`/cart/${newCartId}`)
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

    describe('POST \'/cart/cart_id/checkout\'', () => {

        describe('Valid token', () => {

            it ('Should reject an empty cart with 404 error', (done) => {
                request(app)
                    .post(`/cart/${newCartId}/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(404)
                    .end((err, res) => {
                        if (err) return done(err);
                        return done();
                    });
            })

            it ('Should create a new order', async () => {
                // add a product to cart to avoid empty cart error 
                await CartItem.create({ ...product, cart_id: newCartId });
                const res = await request(app)
                    .post(`/cart/${newCartId}/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                newOrderId = res.body.order.id;
            })
        }),

        describe('Invaid token', () => {

            it ('Should return 401 error', (done) => {
                request(app)
                    .post(`/cart/${newCartId}/checkout`)
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