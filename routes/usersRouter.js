const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// const users = [];

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
  .post(async (req, res) => {
    try {
      const { name, password } = req.body;
      const payload = {
        name: name,
      };

      const accessToken = jwt.sign(payload, process.env.SECRET);
      res
        .status(200)
        .json({ message: "Login Successful", accessToken: accessToken });

      // res.send("success");
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;
