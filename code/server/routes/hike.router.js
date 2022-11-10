"use strict";

const HikeManager = require("../controllers/HikeManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

//POST HIKE
router.post("/:id", async (req, res) => {
  let writer_id = req.params.id;
  try {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });

    const hikeId = await HikeManager.defineHike(
      req.body.hut_id,
      writer_id,
      req.body.track_path,
      req.body.region,
      req.body.city,
      req.body.title,
      req.body.length,
      req.body.expected_time,
      req.body.ascent,
      req.body.difficulty,
      req.body.description,
      req.body.start_point,
      req.body.end_point,
      req.body.reference_point
    );
    return res.status(201).json({ hikeId });
  } catch (exception) {
    console.log(exception);
    const errorCode = exception.code ?? 503;
    const errorMessage =
      exception.result ?? "Something went wrong, please try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});
module.exports = router;
