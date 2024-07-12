const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    console.error({
      message: err.message,
      stack: err.stack,
    });
  
    res.status(statusCode).send({ message: err.message });
  };
  const asyncHandler = (controller) => {
    return async (req, res, next) => {
      try {
        await controller(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
  
  export { errorHandler, asyncHandler };