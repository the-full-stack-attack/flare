import { Request, Response, NextFunction } from 'express';

// Middleware to verify sessions when a user is using the site
const verifySessionView = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

const verifySessionApi = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    next();
  }
};

export { verifySessionView, verifySessionApi };
