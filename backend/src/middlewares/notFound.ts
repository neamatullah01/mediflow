import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};

export default notFound;
