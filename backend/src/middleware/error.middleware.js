export const errorHandler = (error, _req, res, _next) => {
  if (error?.code === 11000) {
    return res.status(400).json({
      message: "A record with this unique value already exists"
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
};
