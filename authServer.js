require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const app = express();

// Connecting to database + logs
mongoose.connect(process.env.DbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log(`Database attached`));

//FOr security
app.use(helmet({ contentSecurityPolicy: false }));
//Express setup
app.use(express.json());

const usersRouter = require("./routes/usersRouter");

app.use("/api/users", usersRouter);

// error handling
app.post((req, res, next) => {
  let err = new Error("API not found!");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    status: "Error",
    message: err.message,
  });
});

//Start the server
app.listen(process.env.Auth_Port, () => {
  console.log(`Server is running at localhost: ${process.env.Auth_Port}`);
});
