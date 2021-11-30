const express = require('express');
const app = express();

const loaders = require('./loaders');

const PORT = process.env.PORT || 4001;

const startServer = async () => {
    // initilize express application
    loaders(app);

    // Bind to port
    app.listen(PORT, () => {
        console.log(`Express server started at port ${PORT}`);
    });
}

startServer();