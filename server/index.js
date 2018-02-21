const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require(`${__dirname}/strategy`);
const {secret} = require(`${__dirname}/../config`);

//initializes express
const app = express();

//configures express
//top-level middleware
app.use( session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000000
    }
}));


//middlewares
app.use( passport.initialize());
app.use( passport.session());
passport.use( strategy );

passport.serializeUser((user, done) => {
    done(null, user);

});

passport.deserializeUser( (user, done) => {
    done(null, user);
})

//endpoint for the user when they try to login
app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/me',
    failureRedirect: '/login',
    failureFlash: true
}))

//endpoint to get user info
app.get('/me', (req, res, next) => {
    if(!req.user) res.redirect('/login');
    else { res.status(200).json(req.user)};
})


//making sure that the server is listening
const port = 3001;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );