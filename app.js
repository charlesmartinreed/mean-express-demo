// Using PUG as our template engine; notice that PUG uses indentation instead of HTML tags

const express = require('express'),
			mongoose = require('mongoose'),
			path = require('path'),
			app = express();

const port = process.env.PORT || 3000;

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

// MIDDLEWARE SETUP

// BODYPARSER
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// EXPRESS SESSION
app.use(session({
	secret: 'pineapples',
	resave: true,
	saveUninitialized: true,
}));

// EXPRESS MESSAGES
app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// EXPRESS VALIDATOR
app.use(expressValidator());

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


// Implementing the router files
let articles = require('./routes/articles');
app.use('/articles', articles);

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})
