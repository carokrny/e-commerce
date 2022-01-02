const router = require('express').Router({ mergeParams : true });
const { postAddress, 
        getAddress,
        putAddress,
        deleteAddress,
        getAllAddresses } = require('../../services/addressService');

module.exports = (app) => {

    app.use('/address', router);

    /**
    * @swagger
    * definition:
    *   Address:
    *     type: object
    *     properties:
    *       id:
    *         type: integer
    *       user_id:
    *         type: integer
    *       address1:
    *         type: string
    *         example: '123 Easy St'
    *       address2:
    *         type: string
    *         nullable: true
    *         example: 'Apt 3'
    *       city:
    *         type: string
    *       state:
    *         type: string
    *         minLength: 2
    *         maxLength: 2
    *         example: 'CA'
    *       zip:
    *         type: string
    *         minLength: 5
    *         maxLength: 10
    *         example: '12345'
    *       country:
    *         type: string
    *         example: 'United States'
    *       created:
    *         type: string
    *         format: date-time
    *       modified:
    *         type: string
    *         format: date-time
    *
    */

    /**
    * @swagger
    * /account/address:
    *   post:
    *     tags:
    *       - Account
    *     description: Creates and returns new address
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: address1
    *         description: first line of user's address
    *         in: body
    *         required: true
    *         type: string
    *       - name: address2
    *         description: second line of user's address
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of user's address
    *         in: body
    *         required: true
    *         type: string
    *       - name: state
    *         description: state of user's address
    *         required: true
    *         type: string
    *         minLength: 2
    *         maxLength: 2
    *       - name: zip
    *         description: zip code of user's address
    *         in: body
    *         required: true
    *         type: string
    *         minLength: 5
    *         maxLength: 10
    *       - name: country
    *         description: country of user's address
    *         in: body
    *         required: true
    *         type: string
    *     responses:
    *       201:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Invalid inputs.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    */
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

    /**
    * @swagger
    * /account/address/all:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns all addresses associated with user
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: An array of Address objects.
    *         schema:
    *           type: array 
    *           items: 
    *             $ref: '#/definitions/Address'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    */
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

    /**
    * @swagger
    * /account/address/{address_id}:
    *   get:
    *     tags:
    *       - Account
    *     description: Returns address with specified address_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: address_id
    *         description: ID associated with user's address
    *         in: path
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Missing address_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified address_id.
    *       404: 
    *         description: No address found with specified address_id.
    */ 
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

    /**
    * @swagger
    * /account/address/{address_id}:
    *   put:
    *     tags:
    *       - Account
    *     description: Updates and returns address with specified ID
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: address1
    *         description: first line of user's address
    *         in: body
    *         required: false
    *         type: string
    *       - name: address2
    *         description: second line of user's address
    *         in: body
    *         required: false
    *         type: string
    *       - name: city
    *         description: city of user's address
    *         in: body
    *         required: false
    *         type: string
    *       - name: state
    *         description: state of user's address
    *         required: false
    *         type: string
    *         minLength: 2
    *         maxLength: 2
    *       - name: zip
    *         description: zip code of user's address
    *         in: body
    *         required: false
    *         type: string
    *         minLength: 5
    *         maxLength: 10
    *       - name: country
    *         description: country of user's address
    *         in: body
    *         required: false
    *         type: string
    *     responses:
    *       200:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Missing address_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified address_id.
    *       404: 
    *         description: No address found with specified address_id.
    */
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

    /**
    * @swagger
    * /account/address/{address_id}:
    *   delete:
    *     tags:
    *       - Account
    *     description: Deletes and returns address with specified ID
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     parameters:
    *       - name: address_id
    *         description: ID associated with user's address
    *         in: path
    *         required: true
    *         type: integer
    *     responses:
    *       200:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Missing address_id.
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/components/responses/UnauthorizedError'
    *       403: 
    *         description: User not associated with specified address_id.
    *       404: 
    *         description: No address found with specified address_id.
    */ 
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