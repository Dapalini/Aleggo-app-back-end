const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Yup = require('yup');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 8,
		max: 1024
	},
	company: {
		type: String,
		max: 1024,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		min: 2,
		max: 255
	},
	password: {
		type: String,
		required: true,
		min: 8,
		max: 1024
	},
	role: {
		type: String,
		required: true,
		enum: ['unVeted', 'user', 'operationsAdmin', 'economyAdmin', 'superAdmin']
	},
	signupNotes: {
		type: String,
		required: true
	}
});

userSchema.methods.generateAuthToken = function () {
	const secretKey = process.env.JWT_SECRET_KEY;
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
			email: this.email,
			role: this.role
		},
		secretKey
	);
	return token;
};

const User = mongoose.model('User', userSchema);

const signupValidationSchema = Yup.object({
	name: Yup.string().required('Name required'),
	email: Yup.string().email('Invalid email format.').required('Email required'),
	company: Yup.string(),
	password: Yup.string()
		.min(8, 'Password must be atleast 8 characters')
		.max(100, 'Password cannot be more than 100 characters')
		.required('Password required'),
	signupNotes: Yup.string()
});

async function validate(user) {
	try {
		await signupValidationSchema.validate(user, { abortEarly: false });
		return null; // Validation successful
	} catch (validationError) {
		const errors = {};
		validationError.inner.forEach((error) => {
			errors[error.path] = error.message;
		});
		return errors; // Return validation errors
	}
}

exports.User = User;
exports.validateSignup = validate;
