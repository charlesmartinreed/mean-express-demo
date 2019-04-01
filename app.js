// Using PUG as our template engine; notice that PUG uses indentation instead of HTML tags

const express = require('express'),
			mongoose = require('mongoose'),
			path = require('path'),
			app = express();

const port = process.env.PORT || 3000;

// connect mongoose to our mongoDB database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open', () => {
	console.log('Successful connection to mongoDB');
})

// check for any DB errors
db.on('error', (err) => {
	console.log(err);
});

// Bring in our Article Model
let Article = require('./models/article');

// BODYPARSER initialization
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// SET PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));


// Load our view engine, PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// This ROUTE is the HOME route
app.get('/', (req, res) => {
	// since we're passing in a view, we use the render method to, well, render it.
	// note that we can also pass values to our view

	Article.find({}, (err, articles) => {
		if(err) {
			console.log(err);
		}else {
			res.render('index', {
				title: 'Articles',
				articles
			})
		}
	});
})

// This ROUTE is used for ADDING AN ARTICLE
app.get('/articles/add', (req, res) => {
	res.render('add_article', {
		title: 'Add new article'
	})
})

// The ROUTE is used for SUBMIT POST
app.post('/articles/add', (req, res) => {
	let article = new Article()
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save((err) => {
		if(err) {
			console.log(err);
			return;
		} else {
			// if we're here, the article was created and added to db
			res.redirect('/');
		}
	});
});

// THIS ROUTES allow us to direct to a single article, by ID
app.get('/article/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		//render the article template
		res.render('article', {
			title: 'Edit Article',
			article
		});
	});
})

// THIS ROUTE allows us to edit a single article, by ID
app.get('/article/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('edit_article', {
			article
		});
	});
});

// THIS ROUTE allows us to UPDATE a single article
app.post('/articles/edit/:id', (req, res) => {
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
			// if we're here, the article was created and added to db
			res.redirect('/');
		}
	});
});

// THIS ROUTE allows us to DELETE a single article
app.delete('/article/:id', (req, res) => {
	let query = {_id: req.params.id}
	Article.remove(query, (err) => {
		if(err) {
			console.log(err);
		}
		res.send('Success'); //by default, this sends HTTP 200
	})
})

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})
