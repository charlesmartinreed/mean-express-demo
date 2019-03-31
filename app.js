const express = require('express'),
			app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('hey.')
})

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})
