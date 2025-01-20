const { Router } = require('express');
const signUpRouter = Router();

  signUpRouter.post('/', (req: any, res: any ) => {

    console.log(`post req to '/' received by signup \n body is ${req.body}`)
    res.sendStatus(201);
    
  } )

module.exports = {
  signUpRouter
};