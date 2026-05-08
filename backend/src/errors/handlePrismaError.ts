interface PrismaKnownRequestError {
  code: string;
  message: string;
  meta?: Record<string, unknown>;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  errorSources: { path: string; message: string }[];
}

const handlePrismaError = (error: PrismaKnownRequestError): ErrorResponse => {
  let statusCode = 500;
  let message = 'Database error occurred';
  let errorSources: { path: string; message: string }[] = [];

  switch (error.code) {
    case 'P2000':
      statusCode = 400;
      message = 'Input data is too long';
      errorSources = [{ path: '', message: 'The provided value is too long for the column' }];
      break;

    case 'P2001':
      statusCode = 404;
      message = 'Record not found';
      errorSources = [{ path: '', message: 'The requested record does not exist' }];
      break;

    case 'P2002':
      statusCode = 409;
      message = 'Duplicate entry';
      errorSources = [
        {
          path: (error.meta?.target as string[])?.join(',') || 'field',
          message: 'A record with this value already exists',
        },
      ];
      break;

    case 'P2003':
      statusCode = 400;
      message = 'Foreign key constraint failed';
      errorSources = [
        {
          path: (error.meta?.field_name as string) || '',
          message: 'The related record does not exist',
        },
      ];
      break;

    case 'P2024':
      statusCode = 400;
      message = 'Foreign key constraint failed on update/delete';
      errorSources = [{ path: '', message: 'Cannot modify or delete due to related records' }];
      break;

    case 'P2005':
      statusCode = 400;
      message = 'Invalid value stored in database';
      errorSources = [{ path: '', message: 'The stored value is invalid for the field type' }];
      break;

    case 'P2006':
      statusCode = 400;
      message = 'Invalid value provided';
      errorSources = [
        {
          path: (error.meta?.target as string[])?.join(',') || '',
          message: 'The provided value is not valid for this field',
        },
      ];
      break;

    case 'P2014':
      statusCode = 400;
      message = 'Required relation violation';
      errorSources = [{ path: '', message: 'The change would violate a required relation' }];
      break;

    case 'P2017':
      statusCode = 404;
      message = 'Related records not found';
      errorSources = [{ path: '', message: 'The required related records do not exist' }];
      break;

    case 'P2025':
      statusCode = 404;
      message = 'Record not found';
      errorSources = [
        {
          path: '',
          message: (error.meta?.cause as string) || 'The record does not exist',
        },
      ];
      break;

    case 'P2033':
      statusCode = 400;
      message = 'Number out of range';
      errorSources = [{ path: '', message: 'A number used in the query is out of range' }];
      break;

    default:
      statusCode = 500;
      message = 'Database error occurred';
      errorSources = [{ path: '', message: `Prisma error code: ${error.code}` }];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaError;
