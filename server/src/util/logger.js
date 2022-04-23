const { configure, getLogger } = require("log4js");
// import { configure, getLogger } from "log4js";

configure({
  appenders: {
    out: {
      type: "stdout",
    },
    app: {
      type: "file",
      filename: `../app.log`,
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

const logger = getLogger();
logger.debug("Logger Level On : ", "info");
module.exports = logger;
