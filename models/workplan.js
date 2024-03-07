const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 8,
		max: 1024
	},
	company: {
		type: String,
		min: 8,
		max: 1024
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
	authorizations: { worker: Boolean, admin: Boolean, economy: Boolean }
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
			email: this.email,
			isAdmin: this.isAdmin
		},
		config.get('jwtPrivateKey')
	);
	return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(2).max(100).required(),
		company: Joi.string().min(2).max(100),
		email: Joi.string().max(255).email().required(),
		password: Joi.string().min(8).max(255).required()
	});

	return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
