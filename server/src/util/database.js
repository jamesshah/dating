const mongoose = require("mongoose");
const LOGGER = require("./logger");

const connectToDatabase = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => LOGGER.info("Database connected"))
    .catch((err) => LOGGER.error("Error connecting to database:", err));
};

module.exports = connectToDatabase;
