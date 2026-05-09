import { ErrorRequestHandler } from 'express';
import * as Sentry from '@sentry/node';
import AppError from '../errors/AppError';
import handleZodError from '../errors/handleZodError';
import handlePrismaError from '../errors/handlePrismaError';
import handlePrismaValidationError from '../errors/handlePrismaValidationError';
import { env } from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(err);
  }

  let statusCode = 500;
  let message = 'Something went wrong';
  let errorSources: { path: string; message: string }[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: '', message: err.message }];
  } else if (err.name === 'ZodError') {
    const zodErrorResponse = handleZodError(err);
    statusCode = zodErrorResponse.statusCode;
    message = zodErrorResponse.message;
    errorSources = zodErrorResponse.errorSources;
  } else if (err.name === 'PrismaClientValidationError') {
    const prismaValidationResponse = handlePrismaValidationError(err);
    statusCode = prismaValidationResponse.statusCode;
    message = prismaValidationResponse.message;
    errorSources = prismaValidationResponse.errorSources;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErrorResponse = handlePrismaError(err);
    statusCode = prismaErrorResponse.statusCode;
    message = prismaErrorResponse.message;
    errorSources = prismaErrorResponse.errorSources;
  } else if (err.code) {
    const prismaErrorResponse = handlePrismaError(err);
    statusCode = prismaErrorResponse.statusCode;
    message = prismaErrorResponse.message;
    errorSources = prismaErrorResponse.errorSources;
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
