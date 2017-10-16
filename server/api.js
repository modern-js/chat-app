const api = require('express')();
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const data = require('./data');

passport.serializeUser(function(user, done) { done(null, user.username); });
passport.deserializeUser(function(username, done) { done(null, data.getUser(username)); });
passport.use(new LocalStrategy( function(name, pass, done) { return done(null, data.getUserForAuth(name,pass)); } ));

api.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
api.use(passport.initialize());
api.use(passport.session());


api.get('/login',
  passport.authenticate('local', { successRedirect: '/me',
                                   failureRedirect: '/',
                                   failureFlash: true })
);
api.get('/logout', (req, res) => { req.logout(); res.send(JSON.stringify({status:'OK'})); });
api.get('/test',(req, res) => { res.send(JSON.stringify({status:'OK'})); });
api.get('/me',(req, res) => { res.send(JSON.stringify({'user':req.user, status:'OK'})); });

module.exports = api;
