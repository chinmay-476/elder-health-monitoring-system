const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};

module.exports = { notFound, errorHandler };
