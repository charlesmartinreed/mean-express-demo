// Using PUG as our template engine; notice that PUG uses indentation instead of HTML tags

const express = require('express'),
			path = require('path'),
			app = express();
const port = process.env.PORT || 3000;

// Load our view engine, PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	// since we're passing in a view, we use the render method to, well, render it.
	// note that we can also pass values to our view
	res.render('index', {
		title: 'Articles',
		body: 'The title was passed in from app.js!'
	});
})

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})
