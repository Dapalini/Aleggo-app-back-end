const bcrypt = require('bcrypt');
const _ = require('lodash');
const {
	ContactLabel,
	validateContactLabel
} = require('../models/contactLabels');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const contactLabels = ContactLabel.find({});
		res.status(200).send(contactLabels);
	} catch (err) {
		res.status(500).send({
			serverError: 'An unknown server error occured.',
			error: err
		});
	}
});

router.post('/', async (req, res) => {
	try {
		const error = await validateContactLabel(req.body);
		if (error) {
			console.log(error);
			return res.status(400).send(error);
		}

		const label = new ContactLabel(req.body);

		console.log(label);

		try {
			console.log('tried to save');
			await label.save();
			res.status(200).send(label);
		} catch (err) {
			console.log(err);
			res.status(500).send({
				serverError: 'An unknown server error occured.',
				error: err
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
});

module.exports = router;
