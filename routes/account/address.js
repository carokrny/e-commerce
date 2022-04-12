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
    * components:
    *   schemas:
    *     id: 
    *       type: integer
    *       minimum: 1
    *       example: 126
    *     address1:
    *       type: string
    *       example: '123 Easy St'
    *       maxLength: 30
    *       pattern: ^[A-Za-z0-9 '#:_-]*$
    *     address2:
    *       type: string
    *       required: false
    *       example: 'Apt 3'
    *       maxLength: 30
    *       pattern: ^[A-Za-z0-9 '#:_-]*$
    *     city:
    *       type: string
    *       example: 'San Francisco'
    *       maxLength: 30
    *       pattern: ^[A-Za-z '-]*$
    *     state:
    *       type: string
    *       minLength: 2
    *       maxLength: 2
    *       example: 'CA'
    *       pattern: ^[A-Z]*$
    *     zip:
    *       type: string
    *       minLength: 5
    *       maxLength: 10
    *       example: '12345'
    *       pattern: ^[0-9-]*$
    *     country:
    *       type: string
    *       example: 'United States'
    *       maxLength: 30
    *       pattern: ^[A-Za- ':-]*$
    *     first_name: 
    *       type: string
    *       example: 'John'
    *       maxLength: 30
    *       pattern: ^[A-Za-z .'_-]*$
    *     last_name:
    *       type: string
    *       example: 'Doe'
    *       maxLength: 30
    *       pattern: ^[A-Za-z .'_-]*$
    *     date_time:
    *       type: string
    *       format: date-time
    *     isPrimaryAddress:
    *       type: boolean
    *       example: false
    * definitions:
    *   Address:
    *     type: object
    *     properties:
    *       id:
    *         $ref: '#/components/schemas/id'
    *       user_id:
    *         $ref: '#/components/schemas/id'
    *       address1:
    *         $ref: '#/components/schemas/address1'
    *       address2:
    *         $ref: '#/components/schemas/address2'
    *       city:
    *         $ref: '#/components/schemas/city'
    *       state:
    *         $ref: '#/components/schemas/state'
    *       zip:
    *         $ref: '#/components/schemas/zip'
    *       country:
    *         $ref: '#/components/schemas/country'
    *       first_name: 
    *         $ref: '#/components/schemas/first_name'
    *       last_name:
    *         $ref: '#/components/schemas/last_name'
    *       created:
    *         $ref: '#/components/schemas/date_time'
    *       modified:
    *         $ref: '#/components/schemas/date_time'
    *       isPrimaryAddress:
    *         $ref: '#/components/schemas/isPrimaryAddress'
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
    *         schema: 
    *           $ref: '#/components/schemas/address1'
    *       - name: address2
    *         description: second line of user's address
    *         in: body
    *         required: false
    *         type: string
    *         schema: 
    *           $ref: '#/components/schemas/address2'
    *       - name: city
    *         description: city of user's address
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/city'
    *       - name: state
    *         description: state of user's address
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/state'
    *       - name: zip
    *         description: zip code of user's address
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/zip'
    *       - name: country
    *         description: country of user's address
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/country'
    *       - name: first_name
    *         description: first name of address recipient
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/first_name'
    *       - name: last_name
    *         description: last name of address recipient
    *         in: body
    *         required: true
    *         schema: 
    *           $ref: '#/components/schemas/last_name'
    *       - name: isPrimaryAddress
    *         description: whether this is user's primary address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/isPrimaryAddress'
    *     responses:
    *       201:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Invalid inputs.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
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
    *           $ref: '#/responses/UnauthorizedError'
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
    *   parameters:
    *     - in: path
    *       name: address_id
    *       description: ID associated with user's address
    *       required: true
    *       schema: 
    *         $ref: '#/components/schemas/id'
    *   get:
    *     tags:
    *       - Account
    *     description: Returns address with specified address_id
    *     produces:
    *       - application/json
    *     security: 
    *       - Bearer: []
    *     responses:
    *       200:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Missing address_id.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
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
    *         schema: 
    *           $ref: '#/components/schemas/address1'
    *       - name: address2
    *         description: second line of user's address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/address2'
    *       - name: city
    *         description: city of user's address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/city'
    *       - name: state
    *         description: state of user's address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/state'
    *       - name: zip
    *         description: zip code of user's address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/zip'
    *       - name: country
    *         description: country of user's address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/country'
    *       - name: first_name
    *         description: first name of address recipient
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/first_name'
    *       - name: last_name
    *         description: last name of address recipient
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/last_name'
    *       - name: isPrimaryAddress
    *         description: whether this is user's primary address
    *         in: body
    *         required: false
    *         schema: 
    *           $ref: '#/components/schemas/isPrimaryAddress'
    *     responses:
    *       200:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Missing address_id.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
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
    *     responses:
    *       200:
    *         description: An Address object.
    *         schema:
    *           $ref: '#/definitions/Address'
    *       400: 
    *         description: Missing address_id.
    *         schema: 
    *           $ref: '#/responses/InputsError'
    *       401: 
    *         description: User not authorized.
    *         schema:
    *           $ref: '#/responses/UnauthorizedError'
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