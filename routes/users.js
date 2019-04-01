const express = require('express'),
			router = express.Router();

const passport = require('passport');
const bcryptjs = require('bcryptjs');

let User = require('../models/user');

// GET REQUEST to register url
router.get('/register', (req, res) => {
	res.render('register');
});

// POST REQUEST to REGISTER user
router.post('/register', (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors) {
		res.render('register', {
			errors
		});
	} else {
		// submit a new user to the DB
		let newUser = new User({
			name,
			email,
			username,
			password
		});

		// salt and hash the password
		bcryptjs.genSalt(10, (err, salt) => {
			bcryptjs.hash(newUser.password, salt, (err, hash) => {
				if(err){
					console.log(err);
				}
					// set password to the hashed version, save to DB
					newUser.password = hash;
					newUser.save((err) => {
						if(err) {
							console.log(error);
							return
						} else {
							req.flash('success', 'You are now registered and can log in');
							res.redirect('/users/login');
						}
					})
			});
		});
	}
});

// GET ROUTE to login
router.get('/login', (req, res) => {
	res.render('login');
})

// POST ROUTE to login process
router.post('/login', (req, res, next) => {
	//call passport
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Don't forget to export!
module.exports = router;
