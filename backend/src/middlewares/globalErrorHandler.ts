import { ErrorRequestHandler } from 'express';
import AppError from '../errors/AppError';
import { env } from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorSources: { path: string; message: string }[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: '', message: err.message }];
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errorSources = err.issues?.map((issue: { path: (string | number)[]; message: string }) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })) || [];
  } else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Database validation error';
    errorSources = [{ path: '', message: err.message }];
  } else if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database request error';
    errorSources = [{ path: '', message: err.message }];
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate entry';
    errorSources = [{ path: err.meta?.target?.join(',') || '', message: 'Already exists' }];
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
    errorSources = [{ path: '', message: 'Resource not found' }];
  }

  const response: Record<string, unknown> = {
    success: false,
    message,
    errorSources,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
