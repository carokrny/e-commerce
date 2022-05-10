const app = require('../app');
const session = require('supertest-session');
const { loginUser, 
    createCart,
    createCartItem,
    createCSRFToken } = require('./testUtils');
const { user3 } = require('./testData').users;
const { product, 
    product2,
    updatedProduct } = require('./testData');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');

describe ('Cart endpoints', () => {

    describe('User logged in', () => {

        let cartId;
        let testSession;
        let csrfToken

        beforeEach(async () => {
            try {
                // create test session
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);

                // log user in
                await loginUser(user3, testSession, csrfToken);
            } catch(e) {
                console.log(e);
            }
        })

        afterEach(async () => {
            // remove cart from db
            try {
                if (cartId) {
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                    await Cart.delete(cartId);
                }
            } catch(e) {
                console.log(e);
            }
        })

        describe('POST \'/cart/item/:product_id\'', () => {

            describe('No existing cart', () => {

                it('Should create a cart and return the cart item', async () => {
                    const res = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(201);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.cart_id).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.quantity).toEqual(product.quantity);
                    cartId = res.body.cartItem.cart_id;
                }) 
            })

            describe('Existing cart', () => {

                beforeEach(async () => {
                    cartId = await createCart(testSession, csrfToken);
                })

                it('Should add product to cart sand return the cart item', async () => {
                    const res = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(201);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.cart_id).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.quantity).toEqual(product.quantity);
                }) 
            })
        })

        describe('Item in cart', () => {

            beforeEach(async () => {
                try {
                    // add item to cart
                    cartId = await createCartItem(product, testSession, csrfToken);
                } catch(e) {
                    console.log(e);
                }
            })

            describe ('POST same item a second time', () => {

                it('Should double the quantity of cart item', async () => {
                    const res = await testSession
                        .post(`/cart/item/${product.product_id}`)
                        .send(product)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(201);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.quantity).toEqual(2 * product.quantity);
                    expect(res.body.cartItem.cart_id).toEqual(cartId);
                })
            })

            describe('GET \'/cart/item/:product_id\'', () => {

                it('Should return the cart item', async () => {
                    const res = await testSession
                        .get(`/cart/item/${product.product_id}`)
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
                            .get(`/cart/item/7`)
                            .set('Accept', 'application/json')
                            .expect(404)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })

            describe('PUT \'/cart/item/:product_id\'', () => {

                describe('Update quantity to positive value', () => {

                    it('Should return the cart item', async () => {
                        const res = await testSession
                            .put(`/cart/item/${product.product_id}`)
                            .send(updatedProduct)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.cartItem).toBeDefined();
                        expect(res.body.cartItem.product_id).toEqual(product.product_id);
                        expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
                        expect(res.body.cartItem.cart_id).toEqual(cartId);
                    })
                })

                describe('Update quantity to zero', () => {

                    it ('Should fail validator and return 400 error', (done) => {
                        testSession
                            .put(`/cart/item/7`)
                            .send({ ...product,
                                quantity: 0 })
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(400)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })      

                describe('Update quantity to negative value', () => {

                        it ('Should fail validator and return 400 error', (done) => {
                            testSession
                                .put(`/cart/item/7`)
                                .send({ ...product,
                                    quantity: -5 })
                                .set('Accept', 'application/json')
                                .set(`XSRF-TOKEN`, csrfToken)
                                .expect(400)
                                .end((err, res) => {
                                    if (err) return done(err);
                                    return done();
                                });
                    })
                })

                describe('Incorrect product_id', () => {

                    it ('Should return 404 error', (done) => {
                        testSession
                            .put(`/cart/item/7`)
                            .send(updatedProduct)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(404)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })

            describe('DELETE \'/cart/item/:product_id\'', () => {

                describe('Not the last item in the cart', () => {

                    beforeEach(async () => {
                        try {
                            // add a different item to cart
                            await createCartItem(product2, testSession, csrfToken);
                        } catch(e) {
                            console.log(e);
                        }
                    })

                    afterEach(async () => {
                        try {
                            if (cartId) {
                                await CartItem.delete({ cart_id: cartId, product_id: product2.product_id });
                                await Cart.delete(cartId);
                                cartId = null;
                            }
                        } catch(e) {
                            console.log(e);
                        }
                    })

                    it('Should return the cart item', async () => {
                        const res = await testSession
                            .delete(`/cart/item/${product.product_id}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.cartItem).toBeDefined();
                        expect(res.body.cartItem.product_id).toEqual(product.product_id);
                        expect(res.body.cartItem.quantity).toEqual(0);
                        expect(res.body.cartItem.cart_id).toEqual(cartId);
                    })
                })

                describe('Item being removed is the last item in the cart', () => {
                    
                    it('Should return the cart item and a null cart_id', async () => {
                        const res = await testSession
                            .delete(`/cart/item/${product.product_id}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.cartItem).toBeDefined();
                        expect(res.body.cartItem.product_id).toEqual(product.product_id);
                        expect(res.body.cartItem.quantity).toEqual(0);
                        expect(res.body.cartItem.cart_id).toEqual(null);
                        cartId = null;
                    })
                })

                describe('Incorrect product_id', () => {

                    it ('Should return 404 error', (done) => {
                        testSession
                            .delete(`/cart/item/${product.product_id + 4}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(404)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })
        })
    })

    describe('User not logged in', () => {

        let testSession;
        let cartId;
        let csrfToken

        beforeEach(async () => {
            try {
                // create test session, no log in
                testSession = session(app);

                // create csrf token
                csrfToken = await createCSRFToken(testSession);
            } catch(e) {
                console.log(e);
            }
        })

        afterEach(async () => {
            try{
                if (cartId) {
                    // remove item from cart
                    await CartItem.delete({ cart_id: cartId, product_id: product.product_id });
                    // delete cart
                    await Cart.delete(cartId);
                }
            } catch(e) {
                console.log(e);
            }
        })

        describe('POST \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Accept', 'application/json')
                    .set(`XSRF-TOKEN`, csrfToken)
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.cart_id).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.quantity).toEqual(product.quantity);
                cartId = res.body.cartItem.cart_id;
            })
        })

        describe('Item in cart', () => {

            beforeEach(async () => {
                try {
                    // add item to cart
                    cartId = await createCartItem(product, testSession, csrfToken);
                } catch(e) {
                    console.log(e);
                }
            })

            describe('GET \'/cart/item/:product_id\'', () => {

                it('Should return the cart item', async () => {
                    const res = await testSession
                        .get(`/cart/item/${product.product_id}`)
                        .set('Accept', 'application/json')
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.cart_id).toEqual(cartId);
                })
            })

            describe('PUT \'/cart/item/:product_id\'', () => {

                it('Should return the cart item', async () => {
                    const res = await testSession
                        .put(`/cart/item/${product.product_id}`)
                        .send(updatedProduct)
                        .set('Accept', 'application/json')
                        .set(`XSRF-TOKEN`, csrfToken)
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.cart_id).toEqual(cartId);
                    expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
                })
            })

            describe('DELETE \'/cart/item/:product_id\'', () => {

                describe('Not the last item in the cart', () => {

                    beforeEach(async () => {
                        try {
                            // add a different item to cart
                            await createCartItem(product2, testSession, csrfToken);
                        } catch(e) {
                            console.log(e);
                        }
                    })

                    afterEach(async () => {
                        try {
                            if (cartId) {
                                await CartItem.delete({ cart_id: cartId, product_id: product2.product_id });
                                await Cart.delete(cartId);
                                cartId = null;
                            }
                        } catch(e) {
                            console.log(e);
                        }
                    })

                    it('Should return the cart item', async () => {
                        const res = await testSession
                            .delete(`/cart/item/${product.product_id}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.cartItem).toBeDefined();
                        expect(res.body.cartItem.product_id).toEqual(product.product_id);
                        expect(res.body.cartItem.quantity).toEqual(0);
                        expect(res.body.cartItem.cart_id).toEqual(cartId);
                    })
                })

                describe('Item being removed is the last item in the cart', () => {
                    
                    it('Should return the cart item and a null cart_id', async () => {
                        const res = await testSession
                            .delete(`/cart/item/${product.product_id}`)
                            .set('Accept', 'application/json')
                            .set(`XSRF-TOKEN`, csrfToken)
                            .expect(200);
                        expect(res.body).toBeDefined();
                        expect(res.body.cartItem).toBeDefined();
                        expect(res.body.cartItem.product_id).toEqual(product.product_id);
                        expect(res.body.cartItem.quantity).toEqual(0);
                        expect(res.body.cartItem.cart_id).toEqual(null);
                        cartId = null;
                    })
                })
            })
        })
    })
})
