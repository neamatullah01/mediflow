interface PrismaValidationError {
  name: string;
  message: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  errorSources: { path: string; message: string }[];
}

const handlePrismaValidationError = (error: PrismaValidationError): ErrorResponse => {
  const statusCode = 400;
  let message = 'Database validation error';
  const errorSources: { path: string; message: string }[] = [];

  const errorMessage = error.message;

  if (errorMessage.includes('Invalid value for argument')) {
    const match = errorMessage.match(/Invalid value for argument `(\w+)`/);
    if (match) {
      const field = match[1] || 'field';
      message = `Invalid value provided for ${field}`;
      errorSources.push({
        path: field,
        message: 'The provided value is not valid for this field',
      });
    }
  } else if (errorMessage.includes('Unknown argument')) {
    const match = errorMessage.match(/Unknown argument `(\w+)`/);
    if (match) {
      const field = match[1] || 'field';
      message = `Unknown field: ${field}`;
      errorSources.push({
        path: field,
        message: 'This field is not recognized by the database',
      });
    }
  } else if (errorMessage.includes('Missing required argument')) {
    const match = errorMessage.match(/Missing required argument `(\w+)`/);
    if (match) {
      const field = match[1] || 'field';
      message = `Missing required field: ${field}`;
      errorSources.push({
        path: field,
        message: 'This field is required but was not provided',
      });
    }
  } else if (errorMessage.includes('Invalid field value')) {
    const match = errorMessage.match(/for field `(\w+)`/);
    if (match) {
      const field = match[1] || 'field';
      message = `Invalid value for field: ${field}`;
      errorSources.push({
        path: field,
        message: 'The value provided is not valid for this field type',
      });
    }
  } else {
    errorSources.push({
      path: '',
      message: errorMessage,
    });
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaValidationError;
