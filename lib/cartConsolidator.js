const Cart = require('../models/CartModel');
const CartItem = require('../models/CartItemModel');

/**
 * Helper function for authService 
 * Roll over existing cart on register or login
 * 
 * @param {number|null} newCartId id of cart prior to register/login to be consolidated
 * @param {number} userId id of the user
 * 
 * @return {Object} contains cart and cartItems assocaited with user
 */
module.exports =  async (newCartId, userId) => {
    
    try {
        // determine if user has created a shopping cart before register/login
        if (newCartId) {
            // check if user already has an old cart from previous login    
            const oldCart = await Cart.findByUserId(userId);

            // if two carts, combine carts 
            if (oldCart) {

                // grab items in old cart
                const oldCartItems = await CartItem.findInCart(oldCart.id);

                // grab items in new cart
                const newCartItems = await CartItem.findInCart(newCartId);

                // check that there are items in old cart (skip if null)
                if (oldCartItems) {
                    
                    // iterate through items in old cart
                    for (const cartItem of oldCartItems) {

                        // check if same item is already in old cart
                        const sameItem = newCartItems.find(newItem => newItem.product_id === cartItem.product_id);

                        if (sameItem) {
                            // update quantity in new cart
                            const updatedQuantity = cartItem.quantity + sameItem.quantity;
                            await CartItem.update({ ...sameItem, quantity: updatedQuantity });
                        } else {
                            // add item to new cart
                            await CartItem.create({ ...cartItem, cart_id: newCartId });
                        }

                        // delete item from new cart
                        await CartItem.delete({ ...cartItem });
                    }
                }
                // delete old cart
                await Cart.delete(oldCart.id);
            } 
            // update user's new shopping cart with user's id
            const cart = await Cart.update({ id: newCartId, user_id: userId });

            // grab items in cart 
            const cartItems = await CartItem.findInCart(newCartId);

            // return id of new cart 
            return {
                cart,
                cartItems
            };
        } else {
            // check if user has a cart from a previous session 
            const oldCart = await Cart.findByUserId(userId);

            // if two carts, combine carts 
            if (oldCart) {

                // grab items in cart
                const cartItems = await CartItem.findInCart(oldCart.id);

                return { 
                    cart: oldCart, 
                    cartItems: cartItems
                }
            } else {
                // return empty cart 
                return {
                    cart: null,
                    cartItems: []
                };
            }
        }
    } catch(err) {
        throw err;
    }
}