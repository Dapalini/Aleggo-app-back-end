const users = require('../routes/users');
const auth = require('../routes/auth');
const verifyToken = require('../routes/verifyToken');
const places = require('../routes/places');
const contactLabels = require('../routes/contactLables');

module.exports = function (app) {
	app.use('/api/users', users);
	app.use('/api/auth', auth);
	app.use('/api/verifyToken', verifyToken);
	app.use('/api/places', places);
	app.use('/api/contactLabels', contactLabels);
};
