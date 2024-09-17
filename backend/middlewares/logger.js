export default (req, res, next) => {
  res.on('finish', () => {
    const statusObject = {
      reqBody: req.body,
      status: res.statusCode,
    };

    const logTemplate = `\x1b[32m${req.method} request to \x1b[31m${
      req.originalUrl
    } \x1b[0mon \x1b[33m${new Date().toISOString()} \x1b[0m`;

    console.log(logTemplate, statusObject);
  });

  next();
};
