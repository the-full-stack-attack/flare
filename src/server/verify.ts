import { Request, Response, NextFunction } from 'express';

// Middleware to verify sessions when a user is using the site
const verifySession = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

export default verifySession;
