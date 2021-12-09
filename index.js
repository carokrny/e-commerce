require('dotenv').config();
const app = require('./app');

// Bind to port to start server
app.listen(process.env.PORT, () => {
    console.log(`Express server started at port ${process.env.PORT}`);
});