// structuring our data at the application level using mongoose schema/model
const mongoose = require('mongoose');

// SCHEMA
let articleSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	}
})

// MODEL
let Article = module.exports = mongoose.model('Article', articleSchema)
