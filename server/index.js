const app = require("./src/server");
const LOGGER = require("./src/util/logger");

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) LOGGER.error(err);
  LOGGER.info(`Server up and running on PORT ${PORT}`);
});
