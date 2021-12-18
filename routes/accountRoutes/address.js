const router = require('express').Router({ mergeParams : true });
const { postAddress, 
        getAddress,
        putAddress,
        deleteAddress,
        getAllAddresses } = require('../../services/addressService');

module.exports = (app) => {

    app.use('/address', router);

    // POST a new address for user
    router.post('/', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await postAddress({ ...req.body, user_id: user_id });

            // send response to client 
            res.status(201).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET all of a user's addresses
    router.get('/all', async (req, res ,next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // await response 
            const response = await getAllAddresses(user_id);

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // GET a particular address of a user 
    router.get('/:address_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;
             
            // grab address from express params
            const address_id = req.params.address_id;

            // await response 
            const response = await getAddress({ address_id, user_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // PUT a particular address of a user 
    router.put('/:address_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // grab address from express params
            const address_id = req.params.address_id;

            // await response 
            const response = await putAddress({
                ...req.body, 
                address_id: address_id, 
                user_id: user_id
            });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

    // DELETE a particular address of a user
    router.delete('/:address_id', async (req, res, next) => {
        try {
            // grab user_id from jwt
            const user_id = req.jwt.sub;

            // grab address from express params
            const address_id = req.params.address_id;

            // await response 
            const response = await deleteAddress({ address_id, user_id });

            // send response to client
            res.status(200).json(response);
        } catch(err) {
            next(err);
        }
    });

}