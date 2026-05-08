import { ZodError, ZodIssue } from 'zod';

interface ErrorResponse {
  statusCode: number;
  message: string;
  errorSources: { path: string; message: string }[];
}

const handleZodError = (error: ZodError): ErrorResponse => {
  const statusCode = 400;
  const message = 'Validation failed';

  const errorSources = error.issues.map((issue: ZodIssue) => {
    let path = '';

    if (issue.path.length > 0) {
      path = issue.path
        .map((segment, index) => {
          const strSegment = String(segment);
          if (typeof segment === 'number') {
            return `[${segment}]`;
          }
          if (index === 0) {
            return strSegment;
          }
          const prev = issue.path[index - 1];
          if (typeof prev === 'number') {
            return `.${strSegment}`;
          }
          return `.${strSegment}`;
        })
        .join('');
    }

    return {
      path,
      message: issue.message,
    };
  });

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleZodError;
