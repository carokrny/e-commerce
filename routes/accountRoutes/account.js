const router = require('express').Router();
const ordersRouter = require('./orders');
const addressRouter = require('./address');
const { getAccount, putAccount } = require('../../services/accountService');
const { isAuth }  = require('../../lib/jwtAuth');

module.exports = (app) => {

    app.use('/account', router);

    router.use(isAuth);

    // GET user info when user is logged into account
    router.get('/', async (req, res ,next) => {
        // grab user_id from jwt
        const user_id = req.jwt.sub;

        // await response
        const response = await getAccount(user_id);
        
        // send response to client
        res.status(200).json(response);
    });

    // PUT user update when user is logged into account
    router.put('/', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await putAccount({ ...req.body, user_id: user_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // extend route to user's orders
    ordersRouter(router);

    //extend route to user's addresses
    addressRouter(router);
}