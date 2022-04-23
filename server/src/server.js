const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");
const connectToDatabase = require("./util/database");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorMiddleware");

require("dotenv").config("../.env");

const app = express();

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
// app.use(cookieEncrypter(process.env.COOKIE_PARSER_SECRET));

app.use("/api/users", require("./routes/user.routes"));

app.use(notFound);
app.use(errorHandler);

connectToDatabase();

module.exports = app;
