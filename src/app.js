const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}))

app.use(require('./controllers/authController'));

app.use(cookieParser())

module.exports = app;