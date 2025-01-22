import express from 'express';
import path from 'path';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import passport from 'passport';
import routes from './routes/index';
import dotenv from 'dotenv';

const app = express();
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
  signUpRouter,
} = routes;

dotenv.config();

app.use(express.static(path.resolve(__dirname, '../../dist')));
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);

// Create a session for the passport to use
app.use(
  session({
    // Name of the cookie
    name: 'google-auth-session',
    // String, stored in .env file
    secret: process.env.SESSION_SECRET || 'asldfkjasdlkfjasldfkjasldf',
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
app.use('/signup', signUpRouter);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'stinky',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'stinky',
      callbackURL: '/auth/callback',
      passReqToCallback: true,
    },
    (
      req: unknown,
      accessToken: unknown,
      refreshToken: unknown,
      profile: any,
      done: Function
    ) => {
      // Can save user info
      done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done: Function) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: Function) => {
  done(null, user);
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
    successRedirect: '/home',
  })
);

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

app.all('*', (req: any, res: any) => {
  res.sendFile('index.html', {
    root: path.resolve(__dirname, '..', '..', 'dist'),
  });
});

export default app;
