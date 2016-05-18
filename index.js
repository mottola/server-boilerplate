// main starting point of application
const express = require ('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// MongoDB setup
 mongoose.connect('mongodb://localhost:auth/auth');

// application setup and middleware

// used for terminal debugging
app.use(morgan('combined'));
// parses any passed data into json
app.use(bodyParser.json({ type: '*/*' }));
router(app);



// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server Running on port:', port);
