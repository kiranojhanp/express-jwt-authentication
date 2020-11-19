require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connecting to database + logs
mongoose.connect(process.env.DbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log(`Database attached`));

//Express setup
app.use(express.json());

const subscribersRouter = require("./routes/subscribersRouter");
app.use("/api/subscribers", subscribersRouter);

// error handling
app.use((req, res, next) => {
  let err = new Error("Not found!");
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
app.listen(process.env.Port, () => {
  console.log(`Server is running at localhost: ${process.env.Port}`);
});
