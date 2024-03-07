const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const config = require('config');
const cookieParser = require('cookie-parser');

module.exports = function (req, res, next) {
	if (!config.get('authRequired')) next();

	app.use(cookieParser);

	const secretKey = process.env.JWT_SECRET_KEY;
	const token = req.cookies.jwtToken;
	if (!token)
		return res
			.status(401)
			.send({ message: 'Access denied. No token provided.' });

	try {
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send({
			message:
				'Access denied, you need to login again as there is an invalid token.'
		});
	}
};
