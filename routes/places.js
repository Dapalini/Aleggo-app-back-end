const express = require('express');
const _ = require('lodash');
const Yup = require('yup');

const { Place, validatePlace } = require('../models/places');
const router = express.Router();

router.get('/', async (req, res) => {
	const places = await Place.find(
		{},
		'_id customerNumber name fullAddress addressLocation startDate endDate basicInfo'
	);
	res.send(places);
});

router.get('/:id', async (req, res) => {
	try {
		const place = await Place.findOne(
			{ _id: req.params.id },
			'customerNumber name fullAddress addressLocation startDate endDate basicInfo contactType'
		);

		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		res.send(place);
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.post('/', async (req, res) => {
	const error = await validatePlace(req.body);
	if (error) {
		return res.status(400).send(error);
	}

	if (req.body && req.body._id) {
		let place = await Place.findOne({ _id: req.body._id });
		if (place) {
			return res
				.status(400)
				.send({ message: 'This place already exists.', place });
		}
		return res.status(400).send({
			message: 'The place should not have an _id key on creation.',
			place
		});
	}

	const place = new Place(req.body);

	try {
		await place.save();
		res.send(place);
	} catch (err) {
		res
			.status(500)
			.send({ serverError: 'An unknown server error occured.', error: err });
	}
});

router.patch('/:id', async (req, res) => {
	const updateFields = req.body;

	try {
		const place = await Place.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: updateFields },
			{ new: true } // To return the updated document
		);

		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		res.send(place);
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const place = await Place.findOneAndRemove({ _id: req.params.id });

		if (!place) {
			return res.status(404).json({ message: 'Place not found' });
		}

		res.json({ message: 'Place deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

// Function to generate dynamic validation schema for a field
function generateFieldValidationSchema(field) {
	return Yup.string().when(field, {
		is: (value) => value !== undefined && value !== null,
		then: Yup.string().required('Required'),
		otherwise: Yup.string()
	});
}

module.exports = router;
