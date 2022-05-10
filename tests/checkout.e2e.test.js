const app = require('../app');
const session = require('supertest-session');
const { loginUser, 
    createCart, 
    createCartItem, 
    createCSRFToken } = require('./testUtils');
const { user6, 
    user7, 
    user8 } = require('./testData').users;
const { testRegister2,
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

describe('Checkout flow E2E', () => {
     
    let cartId;       
    let orderId;                     
    let testSession;
    let paymentId;
    let shippingAddressId;
    let billingAddressId;
    let csrfToken

    beforeEach(async () => {
        // create test session
        testSession = session(app);

        // create csrf token
        csrfToken = await createCSRFToken(testSession);
    })

    afterEach(async() => {
        try{
            if (cartId) {
                // delete cart item
                await CartItem.delete({ cart_id: cartId, product_id: product.product_id });

                // delete cart
                await Cart.delete(cartId);
            }

            if (orderId) {
                // delete order item
                await OrderItem.delete({ order_id: orderId, product_id: product.product_id });

                // delete order
                const order = await Order.delete(orderId);

                // delete payment method 
                await Card.delete(paymentId || order.payment_id);
                    
                // delete shipping address
                await Address.delete(shippingAddressId || order.shipping_address_id);

                // delete billing address
                if (billingAddressId || order.shipping_address_id !== order.billing_address_id) {
                    await Address.delete(billingAddressId || order.billing_address_id);
                }
                
            }
        } catch(e) {
            console.log(e);
        }

        cartId = null;
        orderId = null;
        paymentId = null;
        shippingAddressId = null;
        billingAddressId = null;
    })

    afterAll(async() => {
        try {
            await User.deleteByEmail(testRegister2.email);
        } catch(e) {
            console.log(e);
        }
    })

    describe('User is logged in', () => {

        describe('Empty cart', () => {

            beforeEach(async () => {
                try {
                    // login user
                    await loginUser(user6, testSession, csrfToken);

                    // create cart 
                    cartId = await createCart(testSession, csrfToken);
                } catch(e) {
                    console.log(e);
                }
            })

            it ('Should reject checkout flow with 404 error', async () => {
                const res = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(404);
            })
        })

        describe('Go through full checkout', () => {

            beforeEach(async () => {
                try {
                    // login user
                    await loginUser(user6, testSession, csrfToken);

                    // add item to cart
                    cartId = await createCartItem(product, testSession, csrfToken);
                } catch(e) {
                    console.log(e);
                }
            })

            it('Should successfully create order', async () => {
                
                // access checkout, redirect to shipping
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res2.body).toBeDefined();

                // post shipping information, be redirected to payment
                const res3 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: user6.first_name,
                        last_name: user6.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res3.body).toBeDefined();

                // post payment and billing information, be redirected to order review
                const res4 = await testSession
                    .post(`/checkout/payment`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: user6.first_name,
                        last_name: user6.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order');
                expect(res4.body).toBeDefined();

                // check everything is correct in order review
                const res5 = await testSession
                    .get(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .expect(200)
                expect(res5.body).toBeDefined();
                expect(res5.body.cart).toBeDefined();
                expect(res5.body.shipping).toBeDefined();
                expect(res5.body.billing).toBeDefined();
                expect(res5.body.payment).toBeDefined();
                expect(res5.body.cart.id).toEqual(cartId);
                expect(res5.body.shipping.address1).toEqual(addressPost.address1);
                expect(res5.body.billing.address1).toEqual(addressPost.address1);
                expect(res5.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));

                paymentId = res5.body.payment.id;
                shippingAddressId = res5.body.shipping.id;
                billingAddressId = res5.body.billing.id;

                // post order, be redirected to confirmation
                const res6 = await testSession
                    .post(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order/confirmation');
                expect(res6.body).toBeDefined();

                // get order confirmation 
                const res7 = await testSession
                    .get(`/checkout/order/confirmation`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res7.body).toBeDefined();
                expect(res7.body).toBeDefined();
                expect(res7.body.order).toBeDefined();
                expect(res7.body.order.payment_id).toBeDefined();
                expect(res7.body.order.shipping_address_id).toBeDefined();
                expect(res7.body.order.billing_address_id).toBeDefined();
                expect(res7.body.order.user_id).toBeDefined();
                expect(res7.body.order.user_id).toEqual(user6.id);
                expect(res7.body.orderItems).toBeDefined();
                expect(res7.body.orderItems[0]).toBeDefined();
                expect(res7.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res7.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res7.body.orderItems[0].order_id).toEqual(res7.body.order.id);

                orderId = res7.body.order.id;
            })
        })

        describe('Use primary address and payments saved to user', () => {

            let user;
            let address;
            let card;

            beforeEach(async () => {
                try {
                    // login user
                    await loginUser(user8, testSession, csrfToken);

                    // add item to cart
                    cartId = await createCartItem(product, testSession, csrfToken);

                    // create address
                    address = await Address.create({ 
                        ...addressPost, 
                        user_id: user8.id, 
                        first_name: user8.first_name,
                        last_name: user8.last_name
                    });

                    // create payment
                    card = await Card.create({ 
                        ...cardPost, 
                        billing_address_id: address.id,
                        user_id: user8.id 
                    });

                    // make primary address and payment;
                    await User.updatePrimaryPaymentId({ id: user8.id, primary_payment_id: card.id });
                    user = await User.updatePrimaryAddressId({ id: user8.id, primary_address_id: address.id });
                } catch(e) {
                    console.log(e);
                }
            })

            afterEach(async() => {
                // reset user, remove primary payment and primary address
                await User.updatePrimaryPaymentId({ id: user8.id, primary_payment_id: null });
                await User.updatePrimaryAddressId({ id: user8.id, primary_address_id: null });
            })

            it('Should successfully create order', async () => {
                
                // access checkout, redirect to shipping
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res2.body).toBeDefined();

                // get addresses associated with user to pick shipping address
                const res3 = await testSession
                    .get(`/checkout/shipping`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res3.body).toBeDefined();
                expect(res3.body.addresses).toBeDefined();
                expect(res3.body.addresses[0]).toBeDefined();
                expect(res3.body.addresses[0].id).toEqual(address.id);
                expect(res3.body.addresses[0].id).toEqual(user.primary_address_id);
                shippingAddressId = res3.body.addresses[0].id;

                // post shipping information, be redirected to payment
                const res4 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ address_id: shippingAddressId })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res4.body).toBeDefined();

                // get payment methods associated with user to pick payment
                const res5 = await testSession
                    .get(`/checkout/payment`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res5.body).toBeDefined();
                expect(res5.body.payments).toBeDefined();
                expect(res5.body.payments[0]).toBeDefined();
                expect(res5.body.payments[0].id).toEqual(card.id);
                expect(res5.body.payments[0].id).toEqual(user.primary_payment_id);
                expect(res5.body.payments[0].billing_address_id).toEqual(address.id);
                expect(res5.body.payments[0].billing_address_id).toEqual(user.primary_address_id);
                paymentId = res5.body.payments[0].id
                billingAddressId = res5.body.payments[0].billing_address_id;

                // post payment and billing information, be redirected to order review
                const res6 = await testSession
                    .post(`/checkout/payment`)
                    .send({ address_id: billingAddressId, 
                        payment_id: paymentId })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order');
                expect(res6.body).toBeDefined();

                // check everything is correct in order review
                const res7 = await testSession
                    .get(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .expect(200)
                expect(res7.body).toBeDefined();
                expect(res7.body.cart).toBeDefined();
                expect(res7.body.shipping).toBeDefined();
                expect(res7.body.billing).toBeDefined();
                expect(res7.body.payment).toBeDefined();
                expect(res7.body.cart.id).toEqual(cartId);
                expect(res7.body.shipping.id).toEqual(shippingAddressId);
                expect(res7.body.shipping.address1).toEqual(address.address1);
                expect(res7.body.billing.id).toEqual(billingAddressId);
                expect(res7.body.billing.address1).toEqual(address.address1);
                expect(res7.body.payment.id).toEqual(paymentId);
                expect(res7.body.payment.card_no.slice(-4)).toEqual(card.card_no.slice(-4));

                // post order, be redirected to confirmation
                const res8 = await testSession
                    .post(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order/confirmation');
                expect(res8.body).toBeDefined();

                // get order confirmation 
                const res9 = await testSession
                    .get(`/checkout/order/confirmation`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(200);
                expect(res9.body).toBeDefined();
                expect(res9.body).toBeDefined();
                expect(res9.body.order).toBeDefined();
                expect(res9.body.order.payment_id).toBeDefined();
                expect(res9.body.order.shipping_address_id).toBeDefined();
                expect(res9.body.order.billing_address_id).toBeDefined();
                expect(res9.body.order.user_id).toBeDefined();
                expect(res9.body.order.user_id).toEqual(user.id);
                expect(res9.body.orderItems).toBeDefined();
                expect(res9.body.orderItems[0]).toBeDefined();
                expect(res9.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res9.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res9.body.orderItems[0].order_id).toEqual(res9.body.order.id);

                orderId = res9.body.order.id;
            })
        })
    })

    describe('User is not logged in before checkout', () => {

        beforeEach(async () => {
            try {
                // create test session
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);
            
                // create cart 
                cartId = await createCart(testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        describe('Empty cart', () => {

            it ('Should reject checkout flow with 404 error', async () => {
                const res = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(404);
            })
        })

        describe('User logs in, goes through full checkout', () => {

            beforeEach(async () => {
                try {
                    // add item to cart
                    cartId = await createCartItem(product, testSession, csrfToken)
                } catch(e) {
                    console.log(e);
                }
            })

            it('Should successfully create order', async () => {

                // access checkout, redirect to auth
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/auth');
                expect(res2.body).toBeDefined();

                // logs in, redirect to shipping
                const res3 = await testSession
                    .post(`/checkout/auth/login`)
                    .send(user7)
                    .set('Accept', 'application/json') 
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res3.body).toBeDefined();

                // post shipping information, be redirected to payment
                const res4 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: user7.first_name,
                        last_name: user7.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res4.body).toBeDefined();

                // post payment and billing information, be redirected to order review
                const res5 = await testSession
                    .post(`/checkout/payment`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: user7.first_name,
                        last_name: user7.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order');
                expect(res5.body).toBeDefined();

                // check everything is correct in order review
                const res6 = await testSession
                    .get(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .expect(200)
                expect(res6.body).toBeDefined();
                expect(res6.body.cart).toBeDefined();
                expect(res6.body.shipping).toBeDefined();
                expect(res6.body.billing).toBeDefined();
                expect(res6.body.payment).toBeDefined();
                expect(res6.body.cart.id).toEqual(cartId);
                expect(res6.body.shipping.address1).toEqual(addressPost.address1);
                expect(res6.body.billing.address1).toEqual(addressPost.address1);
                expect(res6.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));

                paymentId = res6.body.payment.id;
                shippingAddressId = res6.body.shipping.id;
                billingAddressId = res6.body.billing.id;

                // post order, be redirected to confirmation
                const res7 = await testSession
                    .post(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order/confirmation');
                expect(res7.body).toBeDefined();

                // get order confirmation 
                const res8 = await testSession
                    .get(`/checkout/order/confirmation`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res8.body).toBeDefined();
                expect(res8.body).toBeDefined();
                expect(res8.body.order).toBeDefined();
                expect(res8.body.order.payment_id).toBeDefined();
                expect(res8.body.order.shipping_address_id).toBeDefined();
                expect(res8.body.order.billing_address_id).toBeDefined();
                expect(res8.body.order.user_id).toBeDefined();
                expect(res8.body.order.user_id).toEqual(user7.id);
                expect(res8.body.orderItems).toBeDefined();
                expect(res8.body.orderItems[0]).toBeDefined();
                expect(res8.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res8.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res8.body.orderItems[0].order_id).toEqual(res8.body.order.id);

                orderId = res8.body.order.id;
            })
        })

        describe('User registers, go through full checkout', () => {

            beforeEach(async () => {
                try {
                    // add item to cart
                    cartId = await createCartItem(product, testSession, csrfToken)
                } catch(e) {
                    console.log(e);
                }
            })

            it('Should successfully create order', async () => {
                
                // access checkout, redirect to auth
                const res2 = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/auth');
                expect(res2.body).toBeDefined();

                // registers, redirect to shipping
                const res3 = await testSession
                    .post(`/checkout/auth/register`)
                    .send(testRegister2)
                    .set('Accept', 'application/json') 
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res3.body).toBeDefined();

                // post shipping information, be redirected to payment
                const res4 = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: testRegister2.first_name,
                        last_name: testRegister2.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/payment');
                expect(res4.body).toBeDefined();

                // post payment and billing information, be redirected to order review
                const res5 = await testSession
                    .post(`/checkout/payment`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: testRegister2.first_name,
                        last_name: testRegister2.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order');
                expect(res5.body).toBeDefined();

                // check everything is correct in order review
                const res6 = await testSession
                    .get(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .expect(200)
                expect(res6.body).toBeDefined();
                expect(res6.body.cart).toBeDefined();
                expect(res6.body.shipping).toBeDefined();
                expect(res6.body.billing).toBeDefined();
                expect(res6.body.payment).toBeDefined();
                expect(res6.body.cart.id).toEqual(cartId);
                expect(res6.body.shipping.address1).toEqual(addressPost.address1);
                expect(res6.body.billing.address1).toEqual(addressPost.address1);
                expect(res6.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));

                paymentId = res6.body.payment.id;
                shippingAddressId = res6.body.shipping.id;
                billingAddressId = res6.body.billing.id;

                // post order, be redirected to confirmation
                const res7 = await testSession
                    .post(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/order/confirmation');
                expect(res7.body).toBeDefined();

                // get order confirmation 
                const res8 = await testSession
                    .get(`/checkout/order/confirmation`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res8.body).toBeDefined();
                expect(res8.body).toBeDefined();
                expect(res8.body.order).toBeDefined();
                expect(res8.body.order.payment_id).toBeDefined();
                expect(res8.body.order.shipping_address_id).toBeDefined();
                expect(res8.body.order.billing_address_id).toBeDefined();
                expect(res8.body.order.user_id).toBeDefined();
                expect(res8.body.orderItems).toBeDefined();
                expect(res8.body.orderItems[0]).toBeDefined();
                expect(res8.body.orderItems[0].product_id).toEqual(product.product_id);
                expect(res8.body.orderItems[0].quantity).toEqual(product.quantity);
                expect(res8.body.orderItems[0].order_id).toEqual(res8.body.order.id);

                orderId = res8.body.order.id;
            })
        })
    })
})
