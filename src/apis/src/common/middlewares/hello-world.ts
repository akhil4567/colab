import { Request, Response, NextFunction } from 'express';
import { log } from '../classes/log.class';

export const logHelloWorld = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* if ( "condition" ){
        return next();
    } else return res.status(403).send({
        error: 'insufficient permissions'
    }); */

  log.warn('Hello World!!');
  return next();
};
