module.exports = function (req, res, next) {
	console.log('form corse', req.body);
	res.header('Access-Control-Allow-Origin', 'http://localhost:4000/api/users'); // update to match the domain you will make the request from
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
};
