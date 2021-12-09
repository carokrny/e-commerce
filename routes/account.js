const router = require('express').Router();
const ordersRouter = require('./orders');
const { updateAccount } = require('../services/accountService');

module.exports = (app, passport) => {

    app.use('/account', router);

    // GET user info when user is logged into account
    router.get('/', passport.authenticate('jwt', {session: false}), (req, res ,next) => {
        res.json({ user: req.user });
    });
    
    // GET user info when user is logged into account, superfluous to above route
    router.get('/:user_id', passport.authenticate('jwt', {session: false}), (req, res ,next) => {
        res.json({ user: req.user });
    });

    // PUT user update when user is logged into account
    router.put('/:user_id', passport.authenticate('jwt', {session: false}), async (req, res ,next) => {
        try {
            const response = await updateAccount(req.body, req.params.user_id);
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to user's orders
    ordersRouter(router, passport);
}