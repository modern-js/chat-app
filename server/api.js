const api = require('express')();
const session = require('express-session');
const sessionstore = require('sessionstore');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const data = require('./data');

passport.serializeUser(function(user, done) { done(null, user.username); });
passport.deserializeUser(function(username, done) { done(null, data.getUser(username)); });
passport.use(new LocalStrategy( function(name, pass, done) { return done(null, data.getUserForAuth(name,pass)); } ));

api.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false,  },
  store: sessionstore.createSessionStore()
}));
api.use(passport.initialize());
api.use(passport.session());


api.post('/login', (req, res) => {
  passport.authenticate('local', function (err, account) {
                      req.logIn(account, function() {
                        res.send(err ? err : account);
                      });
                    })(req,res);
});

const isAuthenticated = function(req,res,next){
   if(req.user)
      return next();
   else
      return res.json({error: 'User not authenticated', status:'err'})
}

api.get('/check', isAuthenticated, function(req, res){
    res.json({message: 'You are currently logged in!', status:'OK'});
});

api.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.json({message: 'Logged out!', status:'OK'});
});

api.get('/me', isAuthenticated, (req, res) => {
  res.json({'user':req.user, status:'OK'});
});

api.post('/post', isAuthenticated, (req,res) => {
  data.post(sender=req.user.username,target=req.query.username,message=req.query.text);
  res.json({message: 'Posted!', status:'OK'});
});

api.get('/convo', isAuthenticated, (req,res) => {
  res.json({conversation: data.conversation(sender=req.user.username,target=req.query.username), status:'OK'});
});

api.get('/users', isAuthenticated, (req,res) => {
  res.json({list: data.getUsers(), status:'OK'});
});

api.post('/seen', isAuthenticated, (req,res) => {
  data.seen(target=req.user.username,sender=req.query.username);
  res.json({message:'marked as seen', status:'OK'});
});

api.get('/notifications', isAuthenticated, (req,res) => {
  res.json({notifications: data.notifications(req.user.username), status:'OK'});
});

module.exports = api;
