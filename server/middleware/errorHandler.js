import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message);
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      status: error.statusCode,
      message: error.message,
      stack: error.stack
    });
  }

  const response = {
    status: 'error',
    statusCode: error.statusCode,
    message: error.message
  };

  res.status(error.statusCode).json(response);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`
  });
};