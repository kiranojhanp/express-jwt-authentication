const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

let refreshTokens = [];

router.route("/logout").delete((req, res, next) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

router.route("/token").post((req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    let err = new Error("No refresh token");
    err.status = 401;
    return next(err);
  }
  if (!refreshTokens.includes(refreshToken)) {
    let err = new Error("Refresh token not found in database");
    err.status = 403;
    return next(err);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      let err = new Error("Refresh token not cannot be verified");
      err.status = 403;
      return next(err);
    }
    const accessToken = generateAccessToken({ name: payload.name });
    res.json({ accessToken: accessToken });
    console.log(refreshTokens);
  });
});

router
  .route("/register")
  .get((req, res, next) => {
    res.json("Registration");
  })
  .post(async (req, res, next) => {
    const { name, password } = req.body;
    const userExists = await User.exists({ name: name });

    if (userExists) {
      let err = new Error("User already exists!");
      err.status = 400;
      return next(err);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = { name: name, password: hashedPassword };
      User.create(user);

      res.status(201).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

router
  .route("/login")
  .get((req, res) => {
    res.json("Logged in");
  })
  .post((req, res) => {
    try {
      const { name, password } = req.body;
      const payload = {
        name: name,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);

      res.status(200).json({
        message: "Login Successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      // res.send("success");
    } catch (error) {
      res.status(500).send(error);
    }
  });

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "15s" });
}

module.exports = router;
