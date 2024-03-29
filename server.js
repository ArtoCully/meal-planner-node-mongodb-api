
require('dotenv').config()
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api/users', require('./users/users.controller'));
app.use('/api/recipes', require('./recipes/recipes.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.NODE_LOCAL_PORT || 80) : (process.env.NODE_LOCAL_PORT || 3001);
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
