"use strict";

const HutManager = require("../controllers/HutManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

//POST HUT
router.post("/:id", async (req, res) => {
  let writer_id = req.params.id;
  try {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });

    const hutId = await HutManager.defineHut(
      req.body.hut_name,
      writer_id,
      req.body.num_of_beds,
      req.body.cost,
      req.body.altitude,
      req.body.latitude,
      req.body.longitude,
      req.body.city,
      req.body.province,
      req.body.address
    );
    return res.status(201).json({ hutId });
  } catch (exception) {
    console.log(exception);
    const errorCode = exception.code ?? 503;
    const errorMessage =
      exception.result ?? "Something went wrong, please try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});
module.exports = router;
