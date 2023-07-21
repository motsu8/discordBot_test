const express = require('express');
const { port, extensionUrl } = require('./config.json');

const app = express();

app.get('/', (request, response) => {
	response.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
	return response.sendFile('oauth2.html', {root:'.'})
	// return response.send(response)
	// return response.send("login!")
	// return response.redirect(extensionUrl)
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));