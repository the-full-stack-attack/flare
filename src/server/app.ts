import express from 'express';
import path from 'path';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';

import { verifySessionApi, verifySessionView } from './verify';
import apiRouter from './api';
// Helper function will be used to give the user a flare (achievement) for signing up
import { checkForFlares } from './helpers/flares';
import User from './db/models/users';

const app = express();

dotenv.config();

app.use(express.static(path.resolve(__dirname, '../../dist')));
app.use('/favicons', express.static(path.resolve(__dirname, '../../favicons')));
app.use(express.json());

app.use(
  cors({
    origin: process.env.SITE_URL, // THIS WILL NEED TO CHANGE ON DEPLOYMENT...?
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
app.use('/api', (req: any, res: any, next: any) => {
  // Whitelist certain routes that don't need auth
  const publicPaths = ['/api/auth/check', '/api/auth/logout'];
  
  if (publicPaths.includes(req.path)) {
    return next();
  }
  
  return requireAuth(req, res, next);
});

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
        const user: any = await User.findOne({ where: { google_id: profile.id } })
        // Check if they're already a user
        if (user) {
          checkForFlares(user, 'Butterflare Effect');
          console.log('Exists');
          done(null, profile);
        } else {
          // Otherwise, create the user using the id for google_id & emails[0] for email
          User.create({
            google_id: profile.id,
            email: profile.emails[0].value,
          }).then((user: any) => {
              checkForFlares(user, 'Butterflare Effect');
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

app.get('/api/auth/check', (req: any, res: any) => {
  res.json({ 
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

app.post('/api/auth/logout', async (req: any, res: any) => {
  try {
    req.logout(async (error: Error) => {
      if (error) {
        console.error('Error logging out user', error);
        res.status(500).json({ error: 'Logout failed' });
      } else {
        await req.session.destroy();
        await req.sessionStore.clear();
        res.json({ success: true });
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/auth/success', (req: any, res: any) => {
  if (!req.user) {
    return res.redirect('/');
  }
  
  if (req.user.username) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/signup');
  }
});

app.get('/logout', async (req: any, res: any) => {
  req.logout(async (error: Error) => {
    if (error) {
      console.error('Error logging out user', error);
      res.sendStatus(500);
    } else {
      req.session.destroy((error: Error) => {
        if (error) {
          console.error('Error destroying session:', error);
          res.sendStatus(500);
        } else {
          res.clearCookie('google-auth-session');
          res.redirect('/');
        }
      });
    }
  });
});

app.get('/dashboard', verifySessionView, (req: any, res: any) => {
  res.sendFile('index.html', {
    root: path.resolve(__dirname, '..', '..', 'dist'),
  });
});

app.get('/signup', verifySessionView, (req: any, res: any) => {
  res.sendFile('index.html', {
    root: path.resolve(__dirname, '..', '..', 'dist'),
  });
});

export default app;

