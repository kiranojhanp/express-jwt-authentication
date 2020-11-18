const express = require("express");
const port = 3002;

const app = express();

app.use(express.json()); //support json
app.use(express.urlencoded({ extended: false })); //support encoded bodies

app.get("/", (req, res) => {
  console.log(`URL: ${req.url}`);
  res.send("Welcome to Test Api");
});

//Error handling
app.use((req, res, next) => {
  let err = new Error("Not found");
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
app.listen(port, (err) => {
  if (err) return console.log(`Error: ${err}`);
  console.log(`Server is running at localhost: ${port}`);
});
