const router = require('express').Router();
const db = require('../db');

// TEST CASE
// GET user by id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);
        res.status(200).send(result.rows[0]);
    } catch(err) {
        next(err);
    }
});

module.exports = router;