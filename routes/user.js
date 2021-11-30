const express = require('express');
const router = express.Router();

// *** TEMP
const db = require('../db');

// Get particular user
// To test db connection 
router.get('/:id', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
        res.status(200).send(result.rows[0]);
    } catch(err) {
        console.log('In error statement')
        next(err);
    }
});

module.exports = router;