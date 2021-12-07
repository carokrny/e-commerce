const router = require('express').Router({ mergeParams : true });
const { getAllOrders, getOneOrder } = require('../services/orderService');

module.exports = (app, passport) => {
    
    app.use('/orders', router);

    // GET all of a user's orders
    router.get('/all', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const response = await getAllOrders(req.user.id);
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET a particular order
    router.get('/:order_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            console.log('Getting one order...');
            const data = { user_id: req.user.id, order_id: req.params.order_id }
            const response = await getOneOrder(data);
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });
}