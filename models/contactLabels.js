const mongoose = require('mongoose');
const Yup = require('yup');

const contactLabel = new mongoose.Schema({
	value: String,
	label: String,
	type: String
});

const ContactLabel = mongoose.model('ContactLabel', contactLabel);

const contactLabelValidationSchema = Yup.object({
	label: Yup.string().required('Required'),
	type: Yup.string().required('Required'),
	value: Yup.string().required('Required')
});

async function validate(label) {
	try {
		await contactLabelValidationSchema.validate(label, { abortEarly: false });
		return null; // Validation successful
	} catch (validationError) {
		const errors = {};
		validationError.inner.forEach((error) => {
			errors[error.path] = error.message;
		});
		return errors; // Return validation errors
	}
}

exports.ContactLabel = ContactLabel;
exports.validateContactLabel = validate;
