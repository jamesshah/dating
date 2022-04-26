const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { index } = require("../services/user.service");
const LOGGER = require("../util/logger");

// Middleware to authenticate the user using the JWT token provided in the request for protected routes
exports.authorize = asyncHandler(async (req, res, next) => {
  LOGGER.info("Authenticating user");

  // Check for the JWT token in the request cookies or in the headers
  const token = req.cookies.token
    ? jwt.verify(req.cookies.token, process.env.JWT_TOKEN)
    : req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ? jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_TOKEN)
    : null;

  // Token found
  if (token) {
    try {
      // Find user from database using the id decoded from the JWT token.
      const user = await index(token.id);

      // User found, allow request to proceed further
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(500);
        throw new Error("Error occurred while authorizing user");
      }
    } catch (error) {
      LOGGER.error("Auth token failed");
      res.status(401);
      throw new Error("Unauthorized request.");
    }
  }

  // Throw an error if no token provided
  if (!token) {
    LOGGER.error("No auth token provided.");
    res.status(401);
    throw new Error("Unauthorized request.");
  }
});
