// Using PUG as our template engine; notice that PUG uses indentation instead of HTML tags

const express = require('express'),
			mongoose = require('mongoose'),
			path = require('path'),
			app = express();
const port = process.env.PORT || 3000;

// connect mongoose to our mongoDB database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Load our view engine, PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// This ROUTE is the HOME route
app.get('/', (req, res) => {
	// since we're passing in a view, we use the render method to, well, render it.
	// note that we can also pass values to our view
	let articles = [
		{
			id: 1,
			title: 'Article One',
			author: 'Charles Reed',
			body: 'This is article one. It is good.'
		},
		{
			id: 2,
			title: 'Article Two',
			author: 'Blarles Sneed',
			body: 'This is article two. It is also good.'
		},
		{
			id: 1,
			title: 'Article Three',
			author: 'Cathy Bates',
			body: 'This is article three. It is a little frightening.'
		},
	]
	res.render('index', {
		title: 'Articles',
		articles: articles
	});
})

// This route is used for ADDING AN ARTICLE
app.get('/articles/add', (req, res) => {
	res.render('add_article', {
		title: 'Add new article'
	})
})

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})
