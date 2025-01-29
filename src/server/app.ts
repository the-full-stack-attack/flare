import express from 'express';
import path from 'path';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

import verifySession from './verify';
import apiRouter from './api';
import User from './db/models/users';

const app = express();

dotenv.config();

app.use(express.static(path.resolve(__dirname, '../../dist')));
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  })
);

// Create a session for the passport to use
app.use(
  session({
    // Name of the cookie
    name: 'google-auth-session',
    // String, stored in .env file
    secret: process.env.SESSION_SECRET || 'MISSING PASSPORT SESSION SECRET',
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
  })
);

app.use(passport.initialize());
app.use(passport.session());

// For all router endpoints, start with /api
app.use('/api', apiRouter);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'MISSING GOOGLE CLIENTID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MISSING GOOGLE CLIENT SECRET',
      callbackURL: '/auth/callback',
      passReqToCallback: true,
    },
    async (
      req: unknown,
      accessToken: unknown,
      refreshToken: unknown,
      profile: any,
      done: Function
    ) => {
      try {
        // Check if they're already a user
        if (await User.findOne({ where: { google_id: profile.id } })) {
          console.log('Exists');
          done(null, profile);
        } else {
          // Otherwise, create the user using the id for google_id & emails[0] for email
          User.create({
            google_id: profile.id,
            email: profile.emails[0].value,
          }).then(() => {
            done(null, profile);
          });
        }
        // Can save user info
      } catch (error: unknown) {
        console.error('Failed to complete Google Callback:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((profile: any, done: Function) => {
  // Storing google_id at req.session.passport.user.id
  done(null, profile.id);
});

passport.deserializeUser(async (google_id: any, done: Function) => {
  try {
    const user = await User.findOne({ where: { google_id } });
    // req.user
    done(null, user);
  } catch (error: unknown) {
    console.error('Failed passport deserialization:', error);
    done(error, null);
  }
});

app.get(
  '/auth',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
  '/auth/callback/',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/auth/success',
  })
);

app.get('/auth/success', (req: any, res: any) => {
  // Check if the user has a username
  if (req.user.username) {
    res.redirect('/Dashboard');
  } else {
    res.redirect('/Signup');
  }
});

app.get('/logout', async (req: any, res: any) => {
  req.logout(async (error: Error) => {
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

app.get('*', verifySession, (req: any, res: any) => {
  res.sendFile('index.html', {
    root: path.resolve(__dirname, '..', '..', 'dist'),
  });
});

export default app;
