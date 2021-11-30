const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = (app) => {
    // Establish express middleware 

    // enable cross-origin resource sharing
    app.use(cors());

    // parse incoming req into json format
    app.use(bodyParser.json());

    //add error handling middleware

    return app;
}