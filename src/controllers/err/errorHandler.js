function HttpErrHandler(err, req, res, next) {
  // err.name===
  res.status(400).json({
    status: err.status,
    error: {
      statusCode: err.statusCode,
      isOperational: err.isOperational,
      message: err.message,
      name: err.name,
    },
  });
}

module.exports = HttpErrHandler;
