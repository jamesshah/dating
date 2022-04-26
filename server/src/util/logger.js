const { configure, getLogger } = require("log4js");

configure({
  appenders: {
    out: {
      type: "stdout",
    },
    app: {
      type: "file",
      filename: "./logs/app.log",
      maxLogSize: 10485760,
      backups: 1,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ["out", "app"],
      level: "info",
    },
  },
});

// Configuring and returning logger instance for logging in application
const logger = getLogger();
logger.debug("Logger Level On : ", "info");
module.exports = logger;
