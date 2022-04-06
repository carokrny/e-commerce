const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

module.exports = async (app) => {
    
    // swagger definition
    const swaggerDefinition = {
        info: {
            title: 'E-Commerce API',
            version: '1.0.0',
            description: 'Basic e-commerce API with express and postgres',
        },
        servers: [
            { 
                url: `http://localhost:${process.env.PORT}`, 
                description: 'Development server'
            }
        ],
        responses: {
            UnauthorizedError: {
                description: 'Access token is missing or invalid.',
                example: 'Not authorized.'
            },
            InputsError: {
                description: 'Inputs are invalid.',
                example: 'Invalid inputs.'
            }
        },
        securityDefinitions: {
            Bearer: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }, 
        components: {}
    };

    // options for the swagger docs
    const options = {
        // import swaggerDefinitions
        swaggerDefinition: swaggerDefinition,
        // path to the API docs
        apis: ['./routes/*/*.js'],
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(options);

    // serve swagger,json
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    // serve swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}