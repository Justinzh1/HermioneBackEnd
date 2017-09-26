import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

require('dotenv').config()

var passport = require('passport');
var BoxStrategy = require('passport-box').Strategy;
var BoxSDK = require('box-node-sdk');

passport.serializeUser( function(user, done) {
	done(null, user);
});

passport.deserializeUser( function(obj, done) {
	done(null, obj);
});

passport.use(new BoxStrategy({
    clientID: process.env.BOX_CLIENT_ID, 
    clientSecret: process.env.BOX_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/hermione"
}, (accessToken, refreshToken, profile, done) => {
	User.findOrCreate({ boxId: profile.id}, (err, user) => {
		return done(err, user);
	});
}));

import hermione from './api/hermione';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));
app.use(require('express-session')({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('Home Page');
});

app.get('/auth/box', 
	passport.authenticate('box', { failureRedirect: '/' }),
	(req, res) => {});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
	});

app.use('/hermione', hermione);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log(req);
  res.redirect('/')
}

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
