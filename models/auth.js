const Yup = require('yup');

const validateAuth = async (auth) => {
	const schema = Yup.object({
		email: Yup.string().email().max(255).required('Email is required.'),
		password: Yup.string()
			.min(8, 'Invalid email or password.')
			.max(255, 'Invalid email or password.')
			.required('Password is required.')
	});

	try {
		await schema.validate(auth);
		return null; // Validation succeeded, return null to indicate no errors
	} catch (error) {
		// Validation failed, return an object with errors
		return error;
	}
};

module.exports = validateAuth;
