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
    *     is_primary_address:
    *       type: boolean
    *       example: false
    *     Address:
    *       type: object
    *       properties:
    *         id:
    *           $ref: '#/components/schemas/id'
    *         user_id:
    *           $ref: '#/components/schemas/id'
    *         address1:
    *           $ref: '#/components/schemas/address1'
    *         address2:
    *           $ref: '#/components/schemas/address2'
    *         city:
    *           $ref: '#/components/schemas/city'
    *         state:
    *           $ref: '#/components/schemas/state'
    *         zip:
    *           $ref: '#/components/schemas/zip'
    *         country:
    *           $ref: '#/components/schemas/country'
    *         first_name: 
    *           $ref: '#/components/schemas/first_name'
    *         last_name:
    *           $ref: '#/components/schemas/last_name'
    *         created:
    *           $ref: '#/components/schemas/date_time'
    *         modified:
    *           $ref: '#/components/schemas/date_time'
    *         is_primary_address:
    *           $ref: '#/components/schemas/is_primary_address'
    *     Error:
    *       type: object
    *       properties: 
    *         code: 
    *           type: string
    *         message:
    *           type: string
    *       required:
    *         - code
    *         - message
    *   responses:
    *     UnauthorizedError:
    *       description: JWT is missing or invalid. Attach JWT as Bearer token or in access_token cookie.
    *     InputsError: 
    *       description: One or more inputs are invalid.
    *     ForbiddenError: 
    *       description: The resource does not belong to the user attempting to access it.
    *     NotFoundError: 
    *       description: The resource cannot be found.
    *
    */

    /**
    * @swagger
    * /account/address:
    *   post:
    *     tags:
    *       - Account
    *     summary: Creates and returns new address
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               address1:
    *                 $ref: '#/components/schemas/address1'
    *               address2:
    *                 $ref: '#/components/schemas/address2'
    *               city:
    *                 $ref: '#/components/schemas/city'
    *               state:
    *                 $ref: '#/components/schemas/state'
    *               zip:
    *                 $ref: '#/components/schemas/zip'
    *               country:
    *                 $ref: '#/components/schemas/country'
    *               first_name:
    *                 $ref: '#/components/schemas/first_name'
    *               last_name:
    *                 $ref: '#/components/schemas/last_name'
    *               is_primary_address:
    *                 $ref: '#/components/schemas/is_primary_address'
    *             required:
    *               - address1
    *               - city
    *               - state
    *               - zip
    *               - country
    *               - first_name
    *               - last_name
    *     responses:
    *       201:
    *         description: An Address object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 address: 
    *                   $ref: '#/components/schemas/Address' 
    *       400: 
    *         $ref: '#/components/responses/InputsError'
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
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
    *     summary: Returns all addresses associated with user
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: An array of Address objects.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 addresses:
    *                   type: array
    *                   items: 
    *                     $ref: '#/components/schemas/Address' 
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
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
    *     summary: Returns address with specified address_id
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: An Address object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 address: 
    *                   $ref: '#/components/schemas/Address' 
    *       400: 
    *         $ref: '#/components/responses/InputsError'
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
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
    *     summary: Updates and returns address with specified ID
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     requestBody:
    *       description: body with necessary parameters
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               address1:
    *                 $ref: '#/components/schemas/address1'
    *               address2:
    *                 $ref: '#/components/schemas/address2'
    *               city:
    *                 $ref: '#/components/schemas/city'
    *               state:
    *                 $ref: '#/components/schemas/state'
    *               zip:
    *                 $ref: '#/components/schemas/zip'
    *               country:
    *                 $ref: '#/components/schemas/country'
    *               first_name:
    *                 $ref: '#/components/schemas/first_name'
    *               last_name:
    *                 $ref: '#/components/schemas/last_name'
    *               is_primary_address:
    *                 $ref: '#/components/schemas/is_primary_address'
    *     responses:
    *       200:
    *         description: An Address object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 address: 
    *                   $ref: '#/components/schemas/Address' 
    *       400: 
    *         $ref: '#/components/responses/InputsError'
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
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
    *     summary: Deletes and returns address with specified ID
    *     security: 
    *       - bearerJWT: []
    *       - cookieJWT: []
    *     responses:
    *       200:
    *         description: An Address object.
    *         content:
    *           application/json:  
    *             schema:
    *               type: object
    *               properties: 
    *                 address: 
    *                   $ref: '#/components/schemas/Address' 
    *       400: 
    *         $ref: '#/components/responses/InputsError'
    *       401: 
    *         $ref: '#/components/responses/UnauthorizedError'
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