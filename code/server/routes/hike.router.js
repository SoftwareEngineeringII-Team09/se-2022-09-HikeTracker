"use strict";

const HikeManager = require("../controllers/HikeManager");
const { body, param, validationResult } = require("express-validator");

const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./gpx",
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//from file
router.post("/:id", upload.single("gpx"), async (req, res) => {
  let writer_id = req.params.id;
  let fileName = req.file.originalname;
  try {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });
    const hikeId = await HikeManager.defineHike(
      writer_id,
      req.body.province,
      req.body.city,
      req.body.title,
      req.body.difficulty,
      req.body.description,
      req.body.reference_point,
      fileName
    );
    return res.status(201).json({ hikeId });
  } catch (exception) {
    //console.log(exception);
    const errorCode = exception.code ?? 503;
    const errorMessage =
      exception.result ?? "Something went wrong, please try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});

// Get list of all hikes
router.get("/", async (req, res) => {
  try {
    const hikes = await HikeManager.loadAllHikes();
    return res.status(200).json({ hikes });
  } catch (exception) {
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? "Something went wrong, try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});

// Get hike by Id
router.get(
  "/:hikeId",
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });

      const hike = await HikeManager.loadHikeById(req.params.hikeId);
      return res.status(200).json({ hike });
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// Download hike gpx track
router.get(
  "/:hikeId/download",
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });

      const gpxFile = await HikeManager.getGpxTrackById(req.params.hikeId);
      return res.download(gpxFile);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

module.exports = router;
