const router = require('express').Router({ mergeParams : true });
const { postPayment, 
        getPayment,
        putPayment,
        deletePayment,
        getAllPayments } = require('../../services/paymentService');

module.exports = async (app) => {

    app.use('/payment', router);

    // POST a new payment method for user
    router.post('/', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await postPayment({ ...req.body, user_id: user_id });

            // send response to client 
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET all of a user's payment methods
    router.get('/all', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await getAllPayments(user_id);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET a particular payment method of a user 
    router.get('/:payment_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;
             
            // grab payment from express params
            const payment_id = req.params.payment_id;

            // await response 
            const response = await getPayment({payment_id, user_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // PUT a particular payment of a user 
    router.put('/:payment_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // grab payment from express params
            const payment_id = req.params.payment_id;

            // await response 
            const response = await putPayment({
                ...req.body, 
                payment_id: payment_id, 
                user_id: user_id
            });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // DELETE a particular payment of a user
    router.delete('/:payment_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // grab payment from express params
            const payment_id = req.params.payment_id;

            // await response 
            const response = await deletePayment({ payment_id, user_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}