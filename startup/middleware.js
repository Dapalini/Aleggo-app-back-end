const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

module.exports = function (app) {
	let secretKey = process.env.JWT_SECRET_KEY;

	if (!secretKey) {
		// secretKey = 'aleggoApp';
		secretKey = crypto.randomBytes(32).toString('hex');
		process.env.JWT_SECRET_KEY = secretKey;
	}
	app.use(cors());
	app.use(express.json());
	app.use(cookieParser());
};
