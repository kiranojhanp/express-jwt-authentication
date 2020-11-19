const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

//Get all
router
  .route("/")

  .get(async (req, res, next) => {
    try {
      const subscribers = await Subscriber.find();
      res.json(subscribers);
    } catch (err) {
      err.status = 500;
      return next(err);
    }
  })

  .post(async (req, res, next) => {
    const addSubscriber = new Subscriber({
      name: req.body.name,
      subscribedToChannel: req.body.subscribedToChannel,
    });

    try {
      const newSubscriber = await addSubscriber.save();
      res.status(201).json(newSubscriber);
    } catch (err) {
      //   let err = new Error("");
      err.status = 400;
      return next(err);
    }
  })

  .delete(async (req, res, next) => {
    try {
      const deleteSubscriber = await Subscriber.deleteMany();

      res.status(200).json({
        status: "Success",
        message: `Succesfully deleted ${deleteSubscriber.deletedCount} files `,
      });
    } catch (err) {
      err.status = 400;
      return next(err);
    }
  });

//Get One
router
  .route("/:id")

  .get(getSubscriber, (req, res) => {
    res.json(res.subscriber);
  })

  .patch(getSubscriber, async (req, res, next) => {
    if (req.body.name != null) {
      res.subscriber.name = req.body.name;
    }
    if (req.body.subscribedToChannel != null) {
      res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
    }
    try {
      const updatedSubscriber = await res.subscriber.save();
      res.json(updatedSubscriber);
    } catch (err) {
      err.status = 400;
      return next(err);
    }
  })

  .delete(getSubscriber, async (req, res, next) => {
    try {
      await res.subscriber.remove();
      res.status(200).json({
        status: "Success",
        message: `Successfully deleted subscriber: ${res.subscriber._id}`,
      });
    } catch (err) {
      err.status = 500;
      return next(err);
    }
  });

// get single subscriber data
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      let err = new Error("Cannot find subscriber");
      err.status = 404;
      return next(err);
    }
  } catch (err) {
    // let err = new Error("Cannot find subscriber");
    err.status = 404;
    return next(err);
  }

  res.subscriber = subscriber;
  next();
}

module.exports = router;
