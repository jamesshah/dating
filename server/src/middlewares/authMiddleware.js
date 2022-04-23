const jwt = require("jsonwebtoken");
const { index } = require("../services/user.service");
const LOGGER = require("../util/logger");

exports.authorize = async (req, res, next) => {
  LOGGER.info("Authenticating user");

  const token = req.cookies.token
    ? jwt.verify(req.cookies.token, process.env.JWT_TOKEN)
    : req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ? jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_TOKEN)
    : null;

  // console.log(token);

  if (token) {
    try {
      const user = await index(token.id);

      if (user) {
        req.user = user;
        next();
      } else {
        return res
          .status(500)
          .json({ error: "Error occurred while authorizing user" });
      }
    } catch (error) {
      LOGGER.error("Auth token failed");
      return res.status(401).json({ error: "Unauthorized request." });
    }
  }

  if (!token) {
    LOGGER.error("No auth token provided.");
    return res.status(401).json({ error: "Unauthorized request." });
  }
};
