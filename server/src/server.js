const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectToDatabase = require("./util/database");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorMiddleware");

// .env file for Environment Variables
require("dotenv").config("../.env");

const app = express();

// Middlewares for security
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// Route Definitions for user, notification and messages routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/messages", require("./routes/message.routes"));

// Custom middlewares for error handling
app.use(notFound);
app.use(errorHandler);

// Connecting To Database
connectToDatabase();

module.exports = app;
