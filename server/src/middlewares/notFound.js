// If a route is undefined, send a 404 error with a message.
exports.notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404).json({ error: "page not found" });
};
