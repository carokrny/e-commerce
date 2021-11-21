const express = require('express');
const server = express();

const PORT = process.env.PORT || 4001;

// Home page route 
server.get('/', (req, res) => {
    res.send('Hello world');
});

// Error handling middleware
server.use((req, res) => {
    res.type('text/plain');
    res.status(505);
    res.send('Error page');
});

// Bind to port
server.listen(PORT, () => {
    console.log('Express server started at port 4001');
});