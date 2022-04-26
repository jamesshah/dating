const app = require("./src/server");
const LOGGER = require("./src/util/logger");
const { configSocket } = require("./src/util/socket");

const PORT = process.env.PORT || 5000;

// Starting server
const server = app.listen(PORT, (err) => {
  if (err) LOGGER.error(err);
  LOGGER.info(`Server up and running on PORT ${PORT}`);
});

// Initializing socket configuration
configSocket(server);
