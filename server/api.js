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

api.get('/logout', (req, res) => {
  req.logout();
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({status:'OK'}));
});

api.get('/test',(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({status:'OK'}));
});

api.get('/me',(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.user) return res.send(JSON.stringify({status:'Unauthorized'}));;
  res.send(JSON.stringify({'user':req.user, status:'OK'}));
});

api.post('/post', (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.user) return res.send(JSON.stringify({status:'Unauthorized'}));
  data.post(sender=req.user.username,target=req.query.username,message=req.query.text);
  res.send(JSON.stringify({status:'OK'}));
});

api.get('/convo', (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.user) return res.send(JSON.stringify({status:'Unauthorized'}));
  res.send(JSON.stringify({status:'OK',
                           conversation: data.conversation(sender=req.user.username,target=req.query.username)
  }));
});

api.post('/seen', (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.user) return res.send(JSON.stringify({status:'Unauthorized'}));
  data.seen(target=req.user.username,sender=req.query.username);
  res.send(JSON.stringify({status:'OK'}));
});

api.get('/notifications', (req,res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.user) return res.send(JSON.stringify({status:'Unauthorized'}));
  res.send(JSON.stringify({status:'OK', notifications: data.notifications(req.user.username)}));
});

module.exports = api;
