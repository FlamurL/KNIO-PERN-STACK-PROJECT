import { Request, Response, NextFunction } from 'express';
import Error from '../interfaces/error.interface';
const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || 'Whoops!! something went wrong';
  res.status(status).json({ message });
};

export default errorMiddleware;
