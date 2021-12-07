const router = require('express').Router({ mergeParams : true });
const { getCartItem, 
    postCartItem, 
    putCartItem, 
    deleteCartItem } = require('../services/cartItemService');

module.exports = (app, passport) => {

    app.use('/:cart_id/item', router);

    // GET cart item info by product id
    router.get('/:product_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const { cart_id, product_id } = req.params;

            const response = await getCartItem({ cart_id, product_id });
            
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // POST cart item by product id
    router.post('/:product_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const { cart_id, product_id } = req.params;
            const { quantity } = req.body;

            const response = await postCartItem({ cart_id, product_id, quantity });

            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // PUT cart item by product id
    router.put('/:product_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const { cart_id, product_id } = req.params;
            const { quantity } = req.body;

            const response = await putCartItem({ cart_id, product_id, quantity });

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // DELETE cart item by product id
    router.delete('/:product_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const { cart_id, product_id } = req.params;

            const response = await deleteCartItem({ cart_id, product_id });

            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}