const app = require('../app');
const session = require('supertest-session');
const { loginUser, 
    createCart,
    createCartItem } = require('./testUtils');
const { user3 } = require('./testData').users;
const { product, 
    updatedProduct } = require('./testData');
const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');

describe ('Cart endpoints', () => {

    describe('User logged in', () => {

        let cartId;
        let testSession;

        beforeEach(async () => {
            try {
                // create test session
                testSession = session(app);

                // log user in
                await loginUser(user3, testSession);

                // create cart
                cartId = await createCart(testSession); 
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

            cartId = null;
            testSession = null;
        })

        describe('POST \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.quantity).toEqual(product.quantity);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            }) 
        })

        describe('Item in cart', () => {

            beforeEach(async () => {
                try {
                    // add item to cart
                    await createCartItem(product, testSession);
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

                it('Should return the cart item', async () => {
                    const res = await testSession
                        .put(`/cart/item/${product.product_id}`)
                        .send(updatedProduct)
                        .set('Accept', 'application/json')
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.cart_id).toEqual(cartId);
                    expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
                })

                describe('Incorrect product_id', () => {

                    it ('Should return 404 error', (done) => {
                        testSession
                            .put(`/cart/item/7`)
                            .send(updatedProduct)
                            .set('Accept', 'application/json')
                            .expect(404)
                            .end((err, res) => {
                                if (err) return done(err);
                                return done();
                            });
                    })
                })
            })

            describe('DELETE \'/cart/item/:product_id\'', () => {

                it('Should return the cart item', async () => {
                    const res = await testSession
                        .delete(`/cart/item/${product.product_id}`)
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
                            .delete(`/cart/item/${product.product_id + 4}`)
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
    })

    describe('User not logged in', () => {

        let testSession;
        let cartId;

        beforeEach(async () => {
            try {
                // create test session, no log in
                testSession = session(app);

                // create cart
                cartId  = await createCart(testSession); 
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

            cartId = null;
            testSession = null;
        })

        describe('POST \'/cart/item/:product_id\'', () => {

            it('Should return the cart item', async () => {
                const res = await testSession
                    .post(`/cart/item/${product.product_id}`)
                    .send(product)
                    .set('Accept', 'application/json')
                    .expect(201);
                expect(res.body).toBeDefined();
                expect(res.body.cartItem).toBeDefined();
                expect(res.body.cartItem.product_id).toEqual(product.product_id);
                expect(res.body.cartItem.cart_id).toEqual(cartId);
            })
        })

        describe('Item in cart', () => {

            beforeEach(async () => {
                try {
                    // add item to cart
                    await createCartItem(product, testSession);
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
                        .expect(200);
                    expect(res.body).toBeDefined();
                    expect(res.body.cartItem).toBeDefined();
                    expect(res.body.cartItem.product_id).toEqual(product.product_id);
                    expect(res.body.cartItem.cart_id).toEqual(cartId);
                    expect(res.body.cartItem.quantity).toEqual(updatedProduct.quantity);
                })
            })

            describe('DELETE \'/cart/item/:product_id\'', () => {
                
                it('Should return the cart item', async () => {
                    const res = await testSession
                        .delete(`/cart/item/${product.product_id}`)
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
})
