const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const session = require('express-session');
const passport = require('passport');
const {
    aiRouter,
    aiConversationRouter,
    aiTaskRouter,
    avatarRouter,
    chatRouter,
    chatroomRouter,
    flareRouter,
    eventRouter,
    event2Router,
    userRouter,
    taskRouter,
} = require('/routes');

require('dotenv').config();

app.use(express.static(path.resolve(__dirname, '../../dist')))
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }))
    
    // Create a session for the passport to use
    app.use(session({
        // Name of the cookie
        name: 'google-auth-session',
        // String, stored in .env file
        secret: process.env.SESSION_SECRET,
        /*
        Forces the session to be saved back to the session store:
        Cookie has an expiration time of one hour, so we'll need to re-save
        while the client is using the site to keep the cookie from expiring.
        */
       resave: true,
       /*
       Forces a session that is "uninitialized" to be saved to the store.
       "uninitialized" => New, but not modified
       Choosing false is useful for:
       - Implementing login sessions
       - Reducing server storage usage
       - Complying with laws that require permission before setting a cookie
       - Helps with race conditions where a client makes multiple parallel requests without a session
       */
      saveUninitialized: false,
      // Cookie settings
      cookie: {
          // The cookie will last one hour from when it is created/re-saved
          maxAge: 60000 * 60,
        },
    }))
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use('/ai', aiRouter);
    app.use('/aiConversation', aiConversationRouter);
    app.use('/aiTask', aiTaskRouter);
    app.use('/avatar', avatarRouter);
    app.use('/chat', chatRouter);
    app.use('/chatroom', chatroomRouter);
    app.use('/flare', flareRouter);
    app.use('/event', eventRouter);
    app.use('/event', event2Router);
    app.use('/task', taskRouter);
    app.use('/user', userRouter);
    
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
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


app.all('*', (req, res) => {
    console.log('Req from routes: ', req);
    res.sendFile('index.html', { root: path.resolve(__dirname, '..', '..', 'dist')});
})


module.exports = {
    app
}
