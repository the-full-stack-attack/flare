const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport');
require('dotenv').config();


app.use(express.static(path.resolve(__dirname, '../../dist')))
app.use(express.json());


app.use(
    cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }))


app.use(passport.initialize());
app.use(passport.session())
app.use(new GoogleStrategy({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/callback',
    passReqToCallback: true,
},(req, accessToken, refreshToken, profile, done) => {
    // Can save user info
    done(null, profile);
}));




passport.serializeUser((user, done) => {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/auth', passport.authenticate('google', {
    scope: ['profile', 'email', ],
}));


app.get('/auth/callback/', passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/home',
}));


app.get('/logout', async (req, res) => {
    req.logout(async(error) => {
        if (error) {
            console.error('Error logging out user', error);
            res.sendStatus(500);
        } else {
            await req.session.destroy();
            await req.sessionStore.clear();
            res.redirect('/');
        }
    });
});


// One day...
app.get('/check-session', (req, res) => {

})


module.exports = {
    app
}
