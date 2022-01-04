const app = require('../app');
const request = require('supertest');
const session = require('supertest-session');
const { user5, 
        user6, 
        testRegister2,
        addressPost,
        cardPost, 
        product } = require('./testData');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');
const OrderItem = require('../models/OrderItemModel');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');
const Address = require('../models/AddressModel');
const Card = require('../models/CardModel');

// ---------------- END TO END TESTS -------------------------------------------------------------

describe('Checkout flow end-to-end tests', () => {

    // One for empty cart fail with user auth'ed 
    // X One for empty cart fail with user sign in 
    // One with user register, go through full checkout 
    // One with user login, go through full checkout 
    // X One with user already logged in, go through full checkout
    // ''                   , user uses saved address for shipping and billing
    // ''                   , user uses saved payment method


    var token;      
    var cartId;       
    var orderId;                     
    var testSession;

    afterEach(async() => {
        if (cartId) {
             // delete cart item
            await CartItem.delete({ cart_id: cartId, product_id: product.product_id });

            // delete cart
            await Cart.delete(cartId);

            cartId = null;
        }

        if (orderId) {
            // delete order item
            await OrderItem.delete({ order_id: orderId, product_id: product.product_id });

            // delete order
            const order = await Order.delete(orderId);

            // delete payment method 
            await Card.delete(order.payment_id);
                
            // delete shipping address
            await Address.delete(order.shipping_address_id);

            // delete billing address
            if(order.shipping_address_id !== order.billing_address_id) {
                await Address.delete(order.billing_address_id);
            }
            orderId = null;
        }

        token = null;
    }),

    afterAll(async() => {
        await User.deleteByEmail(testRegister2.email);
    }),

    describe('User is logged in', () => {

        beforeEach(async () => {
            // create JWT for authentication 
            const res = await request(app)
                .post('/login')
                .send(user5);
            token = res.body.token;

            testSession = session(app);

            // create cart 
            const res2 = await testSession
                .post('/cart')
                .set('Authorization', token)
                .set('Accept', 'application/json');
            cartId = res2.body.cart.id;
        }),

        describe('Empty cart', () => {

            it ('Should reject checkout flow with 404 error', async () => {
                const res = await testSession
                    .get(`/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(404);
            })
        }),

        describe('Go through full checkout', () => {

            it('Should successfully create order', async () => {

                // add an item to cart 
                const res1 = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', token)
                    .set('Accept', 'application/json');
                expect(res1.body).toBeDefined();
                
                // access checkout, redirect to shipping
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res2.body).toBeDefined();

                // post shipping information, be redirected to payment
                const res3 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: user5.first_name,
                        last_name: user5.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res3.body).toBeDefined();

                // post payment and billing information, be redirected to summary
                const res4 = await testSession
                    .post(`/checkout/payment`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: user5.first_name,
                        last_name: user5.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/order-summary');
                expect(res4.body).toBeDefined();

                // get order summary 
                const res = await testSession
                    .get(`/checkout/order-summary`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.order.payment_id).toBeDefined();
                expect(res.body.order.shipping_address_id).toBeDefined();
                expect(res.body.order.billing_address_id).toBeDefined();
                expect(res.body.order.user_id).toBeDefined();
                expect(res.body.order.user_id).toEqual(user5.id);
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0]).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res.body.orderItems[0].order_id).toEqual(res.body.order.id);

                orderId = res.body.order.id;
            })
        }),

        describe('Use primary address and payments saved to user', () => {

            it('Should successfully create order', async () => {

                // create address
                const address = await Address.create({ 
                        ...addressPost, 
                        user_id: user5.id 
                    });
                
                // create payment
                const card = await Card.create({ 
                        ...cardPost, 
                        billing_address_id: address.id,
                        user_id: user5.id 
                    });

                // make primary address and payment;
                await User.updatePrimaryPaymentId({ id: user5.id, primary_payment_id: card.id });
                const user = await User.updatePrimaryAddressId({ id: user5.id, primary_address_id: address.id });

                // add an item to cart 
                const res1 = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', token)
                    .set('Accept', 'application/json');
                expect(res1.body).toBeDefined();
                
                // access checkout, redirect to shipping
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res2.body).toBeDefined();

                // post shipping information, be redirected to payment
                const res3 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ address_id: user.primary_address_id, 
                        first_name: user.first_name,
                        last_name: user.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res3.body).toBeDefined();

                // post payment and billing information, be redirected to summary
                const res4 = await testSession
                    .post(`/checkout/payment`)
                    .send({ address_id: user.primary_address_id, 
                        payment_id: user.primary_payment_id,
                        first_name: user.first_name,
                        last_name: user.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/order-summary');
                expect(res4.body).toBeDefined();

                // get order summary 
                const res = await testSession
                    .get(`/checkout/order-summary`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.order.payment_id).toBeDefined();
                expect(res.body.order.shipping_address_id).toBeDefined();
                expect(res.body.order.billing_address_id).toBeDefined();
                expect(res.body.order.user_id).toBeDefined();
                expect(res.body.order.user_id).toEqual(user.id);
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0]).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res.body.orderItems[0].order_id).toEqual(res.body.order.id);

                orderId = res.body.order.id;

                // reset user, remove primary payment and primary address
                await User.updatePrimaryPaymentId({ id: user5.id, primary_payment_id: null });
                await User.updatePrimaryAddressId({ id: user5.id, primary_address_id: null });

            })
        })
    }),

    describe('User is not logged in before checkout', () => {

        beforeEach(async () => {
            testSession = session(app);

            // create cart 
            const res = await testSession
                .post('/cart')
                .set('Authorization', null)
                .set('Accept', 'application/json');
            cartId = res.body.cart.id;
        }),

        describe('Empty cart', () => {

            it ('Should reject checkout flow with 404 error', async () => {
                const res = await testSession
                    .get(`/checkout`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(404);
            })
        }),

        describe('User logs in, go through full checkout', () => {

            it('Should successfully create order', async () => {

                // add an item to cart 
                const res1 = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', null)
                    .set('Accept', 'application/json');
                expect(res1.body).toBeDefined();
                
                // access checkout, redirect to login
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/login-register');
                expect(res2.body).toBeDefined();

                // logs in, redirect to shipping
                const res3 = await testSession
                    .post(`/checkout/login`)
                    .send(user6)
                    .set('Accept', 'application/json') 
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res3.body).toBeDefined();
                token = res3.headers.authorization;

                // post shipping information, be redirected to payment
                const res4 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: user6.first_name,
                        last_name: user6.last_name })
                    .set('Authorization', token)    
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res4.body).toBeDefined();

                // post payment and billing information, be redirected to summary
                const res5 = await testSession
                    .post(`/checkout/payment`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: user6.first_name,
                        last_name: user6.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/order-summary');
                expect(res5.body).toBeDefined();

                // get order summary 
                const res = await testSession
                    .get(`/checkout/order-summary`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.order.payment_id).toBeDefined();
                expect(res.body.order.shipping_address_id).toBeDefined();
                expect(res.body.order.billing_address_id).toBeDefined();
                expect(res.body.order.user_id).toBeDefined();
                expect(res.body.order.user_id).toEqual(user6.id);
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0]).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res.body.orderItems[0].order_id).toEqual(res.body.order.id);

                orderId = res.body.order.id;
                token = null;
            })
        }),

        describe('User registers, go through full checkout', () => {

            it('Should successfully create order', async () => {

                // add an item to cart 
                const res1 = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Authorization', null)
                    .set('Accept', 'application/json');
                expect(res1.body).toBeDefined();
                
                // access checkout, redirect to login-register
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Authorization', null)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/login-register');
                expect(res2.body).toBeDefined();

                // registers, redirect to shipping
                const res3 = await testSession
                    .post(`/checkout/register`)
                    .send(testRegister2)
                    .set('Accept', 'application/json') 
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res3.body).toBeDefined();
                token = res3.headers.authorization;

                // post shipping information, be redirected to payment
                const res4 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: testRegister2.first_name,
                        last_name: testRegister2.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res4.body).toBeDefined();

                // post payment and billing information, be redirected to summary
                const res5 = await testSession
                    .post(`/checkout/payment`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: testRegister2.first_name,
                        last_name: testRegister2.last_name })
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/order-summary');
                expect(res5.body).toBeDefined();

                // get order summary 
                const res = await testSession
                    .get(`/checkout/order-summary`)
                    .set('Authorization', token)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body).toBeDefined();
                expect(res.body.order).toBeDefined();
                expect(res.body.order.payment_id).toBeDefined();
                expect(res.body.order.shipping_address_id).toBeDefined();
                expect(res.body.order.billing_address_id).toBeDefined();
                expect(res.body.order.user_id).toBeDefined();
                expect(res.body.orderItems).toBeDefined();
                expect(res.body.orderItems[0]).toBeDefined();
                expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res.body.orderItems[0].order_id).toEqual(res.body.order.id);

                orderId = res.body.order.id;
                token = null;
            })
        })
   })
})
