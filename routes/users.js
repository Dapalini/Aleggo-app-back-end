const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const { User, validateSignup } = require('../models/users');
const router = express.Router();

router.get('/', async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	res.send(_.pick(user, 'email', 'name', 'company'));
});

router.post('/', async (req, res) => {
	const error = await validateSignup(req.body);
	if (error) {
		return res.status(400).send(error);
	}

	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res
			.status(400)
			.send({ email: 'User with this email already exists.' });
	}
	user = new User(
		_.pick(req.body, ['email', 'name', 'company', 'password', 'signupNotes'])
	);
	user.role = 'operationsAdmin';
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	try {
		await user.save();

		const token = user.generateAuthToken();
		const data = _.pick(user, [
			'_id',
			'name',
			'email',
			'company',
			'signupNotes',
			'role'
		]);

		res.cookie('jwtToken', token, { httpOnly: true }).send(data);
	} catch (err) {
		res
			.status(500)
			.send({ serverError: 'An unknown server error occured.', error: err });
	}
});

module.exports = router;
