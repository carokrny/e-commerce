const express = require('express');
const loaders = require('./loaders');

require('dotenv').config();

const app = express();

const startServer = async () => {
    // initilize express application
    await loaders(app);

    // Bind to port
    app.listen(process.env.PORT, () => {
        console.log(`Express server started at port ${process.env.PORT}`);
    });
}

startServer();