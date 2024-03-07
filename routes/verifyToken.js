const _ = require('lodash');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
	res.status(200).send({ authorized: true });
});
module.exports = router;
