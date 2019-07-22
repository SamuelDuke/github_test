const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config/main');
const apiRouter = require('./apiRouter');

const app = express();

//TODO see if there is a better promise library
// Connect mongoose to handle promises
mongoose.Promise = global.Promise;

// // Database Setup
// mongoose.connection.openUri(config.database);

// Database Setup
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

// Setup middleware for all Express requests
app.use(bodyParser.json({ extended: true}));
app.use(bodyParser.urlencoded({ extended: true}));

// Setup router
apiRouter(app);


let server = app.listen(config.port);
console.log('The server is listing at port ' + config.port + '.');