/**
 * Global error handling middleware
 * Handles different types of errors and returns appropriate responses
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isSuccess = false;

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    isSuccess = false;
  } else if (err.name === 'SyntaxError' && err.status === 400) {
    statusCode = 400;
    message = 'Invalid JSON format';
    isSuccess = false;
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'Request entity too large';
    isSuccess = false;
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request entity too large';
    isSuccess = false;
  } else if (err.status) {
    statusCode = err.status;
    message = err.message || 'Request failed';
    isSuccess = false;
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    is_success: isSuccess,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
};

module.exports = errorHandler;
