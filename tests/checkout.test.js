const app = require('../app');
const session = require('supertest-session');
const { loginUser, 
    createCart, 
    createCartItem, 
    createCSRFToken } = require('./testUtils');
const { user4, 
        user5  } = require('./testData').users;
const { testRegister,
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

describe ('Checkout endpoints', () => {

    describe('Valid auth', () => {

        let cartId;                       
        let testSession;
        let csrfToken;

        beforeEach(async () => {
            try{
                // create test session
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);

                // log user in 
                await loginUser(user4, testSession, csrfToken);

                // create cart
                cartId = await createCart(testSession, csrfToken)

                // add item to cart
                await createCartItem(product, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        afterEach(async() => {
            try {

                // tear down new cart
                if (cartId) {
                    // delete cart item
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });

                    // delete cart
                    await Cart.delete(cartId);                
                }

                // tear down new orders 
                const orders = await Order.findByUserId(user4.id);
                if (orders) {
                    for (const order of orders) {
                        // all orders have same one item
                        await OrderItem.delete({ order_id: order.id, product_id: product.product_id });
                        await Order.delete(order.id);
                    }
                }

                // tear down new payment methods 
                const cards = await Card.findByUserId(user4.id);
                if (cards) {
                    for (const card of cards) {
                        await Card.delete(card.id);
                    }
                }

                // tear down new addresses 
                const addresses = await Address.findByUserId(user4.id);
                if (addresses) {
                    for (const address of addresses) {
                        await Address.delete(address.id)
                    }
                }
            } catch(e) {
                console.log(e);
            }
            cartId = null;
        })

        describe('GET \'/checkout/\'', () => {

            it('Should redirect to \'/checkout/shipping\'', async () => {
                const res = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res.body).toBeDefined();
            })
        })

        describe('GET \'/checkout/auth\'', () => {

            it('Should return a valid response', async () => {
                const res = await testSession
                    .get(`/checkout/auth`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
            })
        })

        describe('POST \'/checkout/auth/login\'', () => {

            it('Should return a valid response', async () => {
                const res = await testSession
                    .post(`/checkout/auth/login`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res.body).toBeDefined();
            })
        })

        describe('POST \'/checkout/auth/register\'', () => {

            it('Should return a valid response', async () => {
                const res = await testSession
                    .post(`/checkout/auth/register`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/checkout/shipping');
                expect(res.body).toBeDefined();
            })
        })

        describe('GET \'/checkout/shipping\'', () => {

            it('Should return a valid response', async () => {
                const res = await testSession
                    .get(`/checkout/shipping`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.addresses).toBeDefined();
            })
        })

        describe('POST \'/checkout/shipping\'', () => {

            describe('first_name and/or last_name are null', () => {

                it('Should fail and redirect back to /shipping', async () => {
                    const res = await testSession
                        .post(`/checkout/shipping`)
                        .send({ ...addressPost, 
                            first_name: null,
                            last_name: null })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/shipping');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('first_name and/or last_name are empty strings', () => {

                it('Should fail redirect back to /shipping', async () => {
                    const res = await testSession
                        .post(`/checkout/shipping`)
                        .send({ ...addressPost, 
                            first_name: "",
                            last_name: "" })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/shipping');
                    expect(res.body).toBeDefined();
                })
            })

            describe('Address has a null field', () => {

                it('Should fail redirect back to /shipping', async () => {
                    const res = await testSession
                        .post(`/checkout/shipping`)
                        .send({ ...addressPost,
                            address1: null, 
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/shipping');
                    expect(res.body).toBeDefined();
                })
            })

            describe('Address has an empty string field', () => {

                it('Should fail redirect back to /shipping', async () => {
                    const res = await testSession
                        .post(`/checkout/shipping`)
                        .send({ ...addressPost,
                            address1: "", 
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/shipping');
                    expect(res.body).toBeDefined();
                })
            })

            describe('Send valid inputs', () => {

                it('Should succeed and redirect to /payment', async () => {
                    const res = await testSession
                        .post(`/checkout/shipping`)
                        .send({ ...addressPost, 
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/payment');
                    expect(res.body).toBeDefined();
                })
            })
        })

        describe('GET \'/checkout/payment\'', () => {

            it('Should return a valid response', async () => {
                const res = await testSession
                    .get(`/checkout/payment`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
                expect(res.body.payments).toBeDefined();
            })
        }) 

        describe('POST \'/checkout/payment\'', () => {

            beforeEach(async () => {
                try {
                    // post shipping info
                    await testSession
                        .post(`/checkout/shipping`)
                        .send({ ...addressPost, 
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken);
                } catch(e) {
                    console.log(e);
                }
            })

            describe('first_name and/or last_name are null', () => {

                it('Should fail and redirect back to /payment', async () => {
                    const res = await testSession
                        .post(`/checkout/payment`)
                        .send({ ...addressPost, 
                            ...cardPost,
                            first_name: null,
                            last_name: null })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/payment');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('first_name and/or last_name are empty strings', () => {

                it('Should fail redirect back to /payment', async () => {
                    const res = await testSession
                        .post(`/checkout/payment`)
                        .send({ ...addressPost, 
                            ...cardPost,
                            first_name: "",
                            last_name: "" })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/payment');
                    expect(res.body).toBeDefined();
                })
            })

            describe('Address has a null field', () => {

                it('Should fail redirect back to /payment', async () => {
                    const res = await testSession
                        .post(`/checkout/payment`)
                        .send({ ...addressPost,
                            address1: null, 
                            ...cardPost,
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/payment');
                    expect(res.body).toBeDefined();
                })
            })

            describe('Address has an empty string field', () => {

                it('Should fail redirect back to /payment', async () => {
                    const res = await testSession
                        .post(`/checkout/payment`)
                        .send({ ...addressPost,
                            address1: "", 
                            ...cardPost,
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/payment');
                    expect(res.body).toBeDefined();
                })
            })

            describe('Send valid inputs', () => {

                it('Should succeed and redirect to /order', async () => {
                    const res = await testSession
                        .post(`/checkout/payment`)
                        .send({ ...addressPost, 
                            ...cardPost,
                            first_name: user4.first_name,
                            last_name: user4.last_name })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/order');
                    expect(res.body).toBeDefined();
                })
            })
        })

        describe('GET \'/checkout/order/confirmation\'', () => {

            describe('Session has valid inputs', () => {

                beforeEach(async () => {
                    try {
                        // post shipping info
                        await testSession
                            .post(`/checkout/shipping`)
                            .send({ ...addressPost, 
                                first_name: user4.first_name,
                                last_name: user4.last_name })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);

                        // post payment and billing info 
                        await testSession
                            .post(`/checkout/payment`)
                            .send({ ...addressPost, 
                                ...cardPost,
                                first_name: user4.first_name,
                                last_name: user4.last_name })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);
                    } catch(e) {
                        console.log(e);
                    }
                })

                it('Should send a summary of the checkout', async () => {

                    const res = await testSession
                        .get(`/checkout/order`)
                        .set('Accept', 'application/json')
                        .expect(200)
                    expect(res.body).toBeDefined();
                    expect(res.body.cart).toBeDefined();
                    expect(res.body.shipping).toBeDefined();
                    expect(res.body.billing).toBeDefined();
                    expect(res.body.payment).toBeDefined();
                    expect(res.body.cart.id).toEqual(cartId);
                    expect(res.body.shipping.address1).toEqual(addressPost.address1);
                    expect(res.body.billing.address1).toEqual(addressPost.address1);
                    expect(res.body.payment.card_no.slice(-4)).toEqual(cardPost.card_no.slice(-4));
                })
            })
        })

        describe('POST \'/checkout/order\'', () => {
            
            describe('Session has valid inputs', () => {
                
                beforeEach(async () => {
                    try {
                        // post shipping info
                        await testSession
                            .post(`/checkout/shipping`)
                            .send({ ...addressPost, 
                                first_name: user4.first_name,
                                last_name: user4.last_name })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);

                        // post payment and billing info 
                        await testSession
                            .post(`/checkout/payment`)
                            .send({ ...addressPost, 
                                ...cardPost,
                                first_name: user4.first_name,
                                last_name: user4.last_name })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);
                    } catch(e) {
                        console.log(e);
                    }
                })

                it('Should redirect to order confirmation', async () => {
                    const res = await testSession
                        .post(`/checkout/order`)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/order/confirmation');
                    expect(res.body).toBeDefined();
                })
            })
        })

        describe('GET \'/checkout/order/confirmation\'', () => {
            
            describe('Order completes before accessing page', () => {

                beforeEach(async () => {
                    try{
                        // post shipping info
                        await testSession
                            .post(`/checkout/shipping`)
                            .send({ ...addressPost, 
                                first_name: user4.first_name,
                                last_name: user4.last_name })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);
                        
                        // post payment and billing info 
                        await testSession
                            .post(`/checkout/payment`)
                            .send({ ...addressPost, 
                                ...cardPost,
                                first_name: user4.first_name,
                                last_name: user4.last_name })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);
                        
                        // post order
                        await testSession
                            .post(`/checkout/order`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken);
                    } catch(e) {
                        console.log(e);
                    }
                })

                it('Should return order information', async () => {
                    const res = await testSession
                        .get(`/checkout/order/confirmation`)
                        .set('Accept', 'application/json')
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.order).toBeDefined();
                    expect(res.body.order.payment_id).toBeDefined();
                    expect(res.body.order.shipping_address_id).toBeDefined();
                    expect(res.body.order.billing_address_id).toBeDefined();
                    expect(res.body.order.user_id).toBeDefined();
                    expect(res.body.order.user_id).toEqual(user4.id);
                    expect(res.body.orderItems).toBeDefined();
                    expect(res.body.orderItems[0]).toBeDefined();
                    expect(res.body.orderItems[0].product_id).toEqual(product.product_id);
                    expect(res.body.orderItems[0].quantity).toEqual(product.quantity);
                    expect(res.body.orderItems[0].order_id).toEqual(res.body.order.id);
                })
            }) 

            describe('Order not completed before accessing page', () => {

                it('Should return a 400 error', async () => {
                    const res = await testSession
                        .get(`/checkout/order/confirmation`)
                        .set('Accept', 'application/json')
                        .expect(400);
                })
            })

        })
    })

    describe('Invalid auth', () => {

        let cartId;
        let testSession;
        let newUserEmail;
        let csrfToken;

        beforeEach(async () => {
            try {
                // create test session
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);

                // create cart
                cartId = await createCart(testSession, csrfToken);

                // add item to cart
                await createCartItem(product, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        afterEach(async() => {
            try {
                if (cartId) {
                    // delete cart item
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });

                    // delete cart
                    await Cart.delete(cartId);
                }

                if (newUserEmail) {
                    await User.deleteByEmail(newUserEmail);
                }
            } catch(e) {
                console.log(e);
            }
            cartId = null;
            newUserEmail = null;
        })

        describe('GET \'/checkout/\'', () => {

            it('Should redirect to \'/checkout/auth\'', async () => {
                const res = await testSession
                    .get(`/checkout`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/checkout/auth');
                expect(res.body).toBeDefined();
            })
        })

        describe('GET \'/checkout/auth\'', () => {

            it('Should return a valid response', async () => {
                const res = await testSession
                    .get(`/checkout/auth`)
                    .set('Accept', 'application/json')
                    .expect(200);
                expect(res.body).toBeDefined();
            })
        })

        describe('POST \'/checkout/auth/login\'', () => {

            describe('email and password entered, but password incorrect', () => {
                
                it('should redirect to /auth', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/login`)
                        .send({ email: user5.email, password: 'wrongPassword' })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/auth');
                    expect(res.body).toBeDefined();
                })
            })

            describe('email and password entered, but email incorrect', () => {
                
                it('should redirect to /auth', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/login`)
                        .send({ email: 'wrong@me.com', password: user5.password })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/auth');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('email and/or password missing', () => {
                
                it('should redirect to /auth', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/login`)
                        .send({ email: null, password: null })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/auth');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('correct email and password entered', () => {
            
                it('should log in user and redirect to shipping', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/login`)
                        .send(user5)
                        .set('Accept', 'application/json') 
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/shipping');
                    expect(res.body).toBeDefined();
                })
            })
        })

        describe('POST \'/checkout/auth/register\'', () => {

            describe('email and/or password is null', () => {
                
                it('should redirect to /auth', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/register`)
                        .send({ email: null, password: null })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/auth');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('email and/or password is empty string', () => {
                
                it('should redirect to /auth', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/register`)
                        .send({ email: "", password: "" })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/auth');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('email already in use', () => {
                
                it('should redirect to /auth', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/register`)
                        .send({ email: user4.email, password: testRegister.password })
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/auth');
                    expect(res.body).toBeDefined();
                })
            }) 

            describe('correct email and password entered', () => {
            
                it('should log in user and redirect to shipping', async () => {
                    const res = await testSession
                        .post(`/checkout/auth/register`)
                        .send(testRegister)
                        .set('Accept', 'application/json') 
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(302)
                        .expect('Location', '/checkout/shipping');
                    expect(res.body).toBeDefined();
                    newUserEmail = testRegister.email;
                })
            })
        })

        describe('GET \'/checkout/shipping\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .get(`/checkout/shipping`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        })

        describe('POST \'/checkout/shipping\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        first_name: user5.first_name,
                        last_name: user5.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        })

        describe('GET \'/checkout/payment\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .get(`/checkout/payment`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        }) 

        describe('POST \'/checkout/shipping\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .post(`/checkout/shipping`)
                    .send({ ...addressPost, 
                        ...cardPost,
                        first_name: user5.first_name,
                        last_name: user5.last_name })
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        })

        describe('GET \'/checkout/order\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .get(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        })

        describe('POST \'/checkout/order/confirmation\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .post(`/checkout/order`)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        })

        describe('GET \'/checkout/order/confirmation\'', () => {

            it('Should redirect to \'/cart\'', async () => {
                const res = await testSession
                    .get(`/checkout/order/confirmation`)
                    .set('Accept', 'application/json')
                    .expect(302)
                    .expect('Location', '/cart');
                expect(res.body).toBeDefined();
            })
        })
    })
})

