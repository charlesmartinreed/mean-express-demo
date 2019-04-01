const express = require('express'),
			router = express.Router();

let User = require('../models/user');

// GET REQUEST to register url
router.get('/register', (req, res) => {
	res.render('register');
});

// Don't forget to export!
module.exports = router;
