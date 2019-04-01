const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/user');
const config = require('./database.js');
const bcryptjs = require('bcryptjs');

module.exports = (passport) => {
	// local strategy implementation
	passport.use(new LocalStrategy((username, password, done) => {
		let query = {username: username};
		User.findOne(query, (err, user) => {
			if(err) throw err;
			if(!user) {
				return done(null, false, {message: 'No user was found'});
			}

			// Match the password
			bcryptjs.compare(password, user.password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch) {
					// this will log us in. Also gives us a req.user obj
					return done(null, user);
				} else {
					return done(null, false, {message: 'Incorrect password'})
				}
			});
		});
	}));

	//serializing users allows passport to check against local stored cookies for authentication instead of making separate discrete requests
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}
