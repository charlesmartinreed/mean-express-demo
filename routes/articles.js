const express = require('express'),
			router = express.Router();

const Article = require('../models/article');

// This ROUTE is used for ADDING AN ARTICLE
router.get('/add', (req, res) => {
	res.render('add_article', {
		title: 'Add new article'
	})
})

// The ROUTE is used for SUBMIT POST
// validation with express-validation
router.post('/add', (req, res) => {
	req.checkBody('title','Title is required').notEmpty();
	req.checkBody('author','Author is required').notEmpty();
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
		article.author = req.body.author;
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

// THIS ROUTES allow us to direct to a single article, by ID
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		//render the article template
		res.render('article', {
			title: 'Edit Article',
			article
		});
	});
})

// THIS ROUTE allows us to edit a single article, by ID
router.get('/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('edit_article', {
			article
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
	let query = {_id: req.params.id}
	Article.remove(query, (err) => {
		if(err) {
			console.log(err);
		}
		res.send('Success'); //by default, this sends HTTP 200
	})
})

module.exports = router;
