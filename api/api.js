var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
// var jwt = require('./services/jwt'); // custom impl.
var jwt = require('jwt-simple'); 
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');

var app = express(); 

app.use(bodyParser.json());
app.use(passport.initialize());

passport.serializeUser(function (user, done) {
	console.log('Serializing user: ' + JSON.stringify(user));

	done(null, user.id);
});

app.use(function (req,res,next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});

var strategyOptions = {
	'usernameField':'email'
}

var loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
	
	var searchUser = {
		email: email
	}

	User.findOne(searchUser, function (err, user) {
	
		if (err) {
			console.error('Error finding user: ' + err);
			return done(err)
		}
		
		if (!user) 
			return done(null, false, {
				message: 'Wrong email/password'
			})

		user.comparePasswords(password, function (err, isMatch) {
			if (err) {
				console.error('Error finding user: ' + err);
				return done(err)
			}

			if (isMatch)
				done(null, user);
			else 
				return done(null, false, {
					message: 'Wrong email/password'
				})
		});
	});	
});

var registerStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
	
	var searchUser = {
		email: email
	}

	User.findOne(searchUser, function (err, user) {
	
		if (err) {
			console.error('Error finding user: ' + err);
			return done(err)
		}
		
		if (user) 
			return done(null, false, {
				message: 'Email already exists'
			})

		var newUser = new User({
			email: email,
			password: password
		});

		newUser.save(function (err) {
			done(null, newUser);
		});
	});	

})


passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);

// Note: we can make this custom in order to pass through a custom err message 
// see videos 49/50
app.post('/register', passport.authenticate('local-register'), function (req,res) {
	createToken(req.user, res);
});

var jobs = [
	'Cook',
	'SuperHero',
	'Unicorn tamer'
];

app.get('/jobs', function (req, res) {
	
	if (!req.headers.authorization) {
		return res.status(401).send({message: 'You are not authorized'});
	}

	var token = req.headers.authorization.split(' ')[1];
	var payload = jwt.decode(token, "shhh..");

	if (!payload.sub) {
		res.status(401).send({message: 'Authentication failed'});
	}	
	else {
		res.json(jobs);
	}

});

// user gets set on req by passport if login is successfull
// Callback only gets called if login works
app.post('/login', passport.authenticate('local-login'), function (req, res) {
	createToken (req.user, res);
});


// user gets set on req by passport if login is successfull
// Callback only gets called if login works
app.post('/auth/google', function (req, res) {

	var authCode = req.body.code;
	var url = 'https://accounts.google.com/o/oauth2/token';

	request.post(url, { 
		json: true, 
		form : {
			code: authCode,
			client_id: req.body.clientId,
			client_secret: 'ftpE35Mbh4tAzXDVqsgfl3Uf',
			redirect_uri: req.body.redirectUri,
			grant_type: 'authorization_code'
		}
	}, function (err, response, token) {
		
		console.log(token);

		var accessToken = token.access_token;
		var headers = {
			Authorization: 'Bearer ' + accessToken 
		}

 		var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
		
		console.log('About to send request for profile.');
		request.get({
			url: apiUrl, 
			headers: headers, 
			json:true}, 
		function (err, response, profile) {
			if (err) {
				console.err('Error getting profile ' + err);
				return;
			}

			console.log('Retrieved user profile from google ' + JSON.stringify(profile));

			User.findOne({googleId: profile.sub}, function (err, foundUser) {
				if (foundUser) {
					console.log('Found user profile');
					return createToken(foundUser, res);
				}

				var newUser = new User();
				newUser.googleId = profile.sub;
				newUser.displayName = profile.name;
				newUser.save(function (err) {
					if (err) return next(err);
					createToken(newUser, res); 
				})
			})
		});
	});

});

function createToken (user, res) {
	var payload = {
		sub: user.id
	};

	var token = jwt.encode(payload, "shhh..");

	res.status(200).send({
		user: user.toJSON(),
		token: token
	})
}

mongoose.connect('mongodb://localhost/psjwt');

var server = app.listen(3000, function () {
	console.log('api listening ', server .address().port);
});

// Test the JWT token generator working
// console.log(jwt.encode('hi', 'secret'));










