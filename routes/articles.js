const express = require('express'),
			router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');

// This ROUTE is used for ADDING AN ARTICLE
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('add_article', {
		title: 'Add new article'
	})
})

// The ROUTE is used for SUBMIT POST
// validation with express-validation
router.post('/add', (req, res) => {
	req.checkBody('title','Title is required').notEmpty();
	req.checkBody('body','Body is required').notEmpty();

	// Get Errors
	let errors = req.validationErrors();
	if(errors){
		res.render('add_article', {
			title:'Add Article',
			errors:errors
		});
	} else {
		let article = new Article();
		article.title = req.body.title;
		// when we're logged in, the req will have a global user attached
		article.author = req.user._id;
		article.body = req.body.body;

		article.save(function(err){
			if(err){
				console.log(err);
				return;
			} else {
				req.flash('success','Article Added');
				res.redirect('/');
			}
		});
	}
});

// THIS ROUTE allows us to edit a single article, by ID
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(article.author != req.user._id) {
			req.flash('danger', 'You are not authorized to edit this article');
			// make sure you return to avoid the causal loop caused by trying to write headers AFTER they've already been sent to the client; this is a no-no in node
			return res.redirect('/');
		}
		//render the article template
		res.render('edit_article', {
			title: 'Edit Article',
			article
		});
	});
});

// THIS ROUTE allows us to return a single article, by ID
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		// since we're tying the user ID to the post, we need to find the author name linked to that ID and use it
		User.findById(article.author, (err, user) => {
			res.render('article', {
				article,
				author: user.name
			});
		});
	});
});

// THIS ROUTE allows us to UPDATE a single article
router.post('/edit/:id', (req, res) => {
	let article = {};

	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id: req.params.id}

	Article.update(query, article, (err) => {
		if(err) {
			console.log(err);
			return;
		} else {
			// if we're here, the article was successfully updated
			req.flash('success', 'Article Updated')
			res.redirect('/');
		}
	});
});

// THIS ROUTE allows us to DELETE a single article
router.delete('/:id', (req, res) => {
	//make sure the user is logged in
	if(!req.user._id) {
		res.status(500).send();
	}

	let query = {_id: req.params.id}

	Article.findById(req.params.id, (err, article) => {
		// if the lgged in user does not own the artice
		if(article.author != req.user._id) {
			res.status(500).send();
		} else {
			Article.remove(query, (err) => {
				if(err) {
					console.log(err);
				}
				res.send('Success'); //by default, this sends HTTP 200
			});
		}
	});
});

// ACCESS CONTROL
function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}

module.exports = router;
