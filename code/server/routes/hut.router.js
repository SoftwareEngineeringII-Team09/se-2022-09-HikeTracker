"use strict";

const HutManager = require("../controllers/HutManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

//POST HUT
router.post("/writers/:writerId", async (req, res) => {
  const writerId = req.params.writerId;
  try {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });

    await HutManager.defineHut(
      req.body.hutName,
      writerId,
      req.body.city,
      req.body.province,
      req.body.region,
      req.body.numOfBeds,
      req.body.cost,
      req.body.latitude,
      req.body.longitude,
      req.body.altitude,
    );
    return res.status(201).end();
  } catch (exception) {
    console.log(exception);
    const errorCode = exception.code ?? 503;
    const errorMessage =
      exception.result ?? "Something went wrong, please try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});
module.exports = router;
