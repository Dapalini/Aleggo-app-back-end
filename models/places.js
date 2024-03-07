const mongoose = require('mongoose');
const Yup = require('yup');

const dateNoteSchema = new mongoose.Schema({
	date: {
		type: String,
		required: true
	},
	note: {
		type: String,
		required: true
	}
});

const idLabelSchema = new mongoose.Schema({
	value: String,
	label: String,
	type: {
		type: String
	}
});

const contactDataItemSchema = new mongoose.Schema({
	label: {
		type: idLabelSchema,
		required: true
	},
	value: {
		type: String,
		required: true
	}
});

const contactDataSchema = new mongoose.Schema({
	renderOrder: {
		type: Number,
		required: true
	},
	contactType: {
		type: idLabelSchema,
		required: true
	},
	contactDataEntry: {
		type: [contactDataItemSchema],
		required: true
	},
	contactNotes: {
		type: String,
		required: true
	}
});

const endDateSchema = new mongoose.Schema({
	date: String,
	isEndDate: Boolean
});

const placeSchema = new mongoose.Schema({
	basicInfo: {
		type: {
			customerNumber: {
				type: String,
				required: false
			},
			name: {
				type: String,
				required: true
			},
			fullAddress: {
				type: String,
				required: true
			},
			addressLocation: {
				type: {
					description: String,
					place_id: String
				},
				required: true
			},
			startDate: {
				type: String,
				required: true
			},
			endDate: String,
			isEndDate: Boolean,
			summaryData: {
				type: String,
				required: false
			},
			importantNotes: {
				type: [dateNoteSchema],
				required: true
			},
			accessData: {
				type: [dateNoteSchema],
				required: true
			},
			contactData: {
				type: [contactDataSchema],
				required: true
			}
		},
		required: true
	}
});

const Place = mongoose.model('Place', placeSchema);

const dateNoteValidationSchema = Yup.object({
	date: Yup.string().required('Required'),
	note: Yup.string().required('Required')
});

const idLabelValidationSchema = Yup.object({
	label: Yup.string().required('Required'),
	type: Yup.string().required('Required'),
	value: Yup.string().required('Required')
});

const contactDataItemValidationSchema = Yup.object({
	label: idLabelValidationSchema,
	value: Yup.string().required('Required')
});

const contactDataValidationSchema = Yup.object({
	renderOrder: Yup.number().required('Required'),
	contactType: idLabelValidationSchema,
	contactDataEntry: Yup.array().of(contactDataItemValidationSchema),
	contactNotes: Yup.array().of(dateNoteValidationSchema)
});

const addressLocationValidationSchema = Yup.object({
	description: Yup.string().required('Required'),
	place_id: Yup.string().required('Required')
});

const placeValidationSchema = Yup.object({
	basicInfo: Yup.object({
		customerNumber: Yup.string(),
		name: Yup.string().required('Required'),
		fullAddress: Yup.string().required('Required'),
		addressLocation: addressLocationValidationSchema,
		startDate: Yup.string().required('Required'),
		endDate: Yup.string().when('isEndDate', {
			is: (val) => val === true, // When someField is true
			then: () => Yup.string().required('End date is required')
		}),
		isEndDate: Yup.boolean().required('Required'),
		summaryData: Yup.string(),
		importantNotes: Yup.array()
			.of(dateNoteValidationSchema)
			.required('Required'),
		accessData: Yup.array().of(dateNoteValidationSchema).required('Required'),
		contactData: Yup.array()
			.of(contactDataValidationSchema)
			.required('Required')
	}).required('Required')
});

async function validate(place) {
	try {
		await placeValidationSchema.validate(place, { abortEarly: false });
		return null; // Validation successful
	} catch (validationError) {
		const errors = {};
		console.log('Validation error', validationError);
		validationError.inner.forEach((error) => {
			errors[error.path] = error.message;
		});
		return errors; // Return validation errors
	}
}

exports.Place = Place;
exports.validatePlace = validate;
