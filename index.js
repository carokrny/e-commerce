const express = require('express');
const app = express();

const db = require('./db');

const PORT = process.env.PORT || 4001;

// Use static server 
app.use(express.static('public'));

// Get particular user
// To test db connection 
app.get('/user/:id', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
        res.status(200).send(result.rows[0]);
    } catch(err) {
        console.log('In error statement')
        next(err);
    }
});


// Bind to port
app.listen(PORT, () => {
    console.log('Express server started at port 4001');
});
