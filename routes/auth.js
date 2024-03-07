const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/users');
const validateAuth = require('../models/auth');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const error = await validateAuth(req.body);
		if (error) {
			const errorArr = error.errors;
			const errorMessage = errorArr.join(' ');
			return res.status(400).send({
				message: errorMessage
			});
		}

		let user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).send({
				message: 'Invalid email or password.'
			});
		}

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			return res.status(400).send({
				message: 'Invalid email or password.'
			});
		}

		const token = user.generateAuthToken();
		const data = _.pick(user, ['_id', 'name', 'email', 'company', 'role']);

		res
			.cookie('jwtToken', token, {
				path: '/main',
				httpOnly: true,
				secure: false
			})
			.send(data);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
});
module.exports = router;
