"use strict";

const HikeManager = require("../controllers/HikeManager");
const { body, param, validationResult } = require("express-validator");
const fs = require("fs");
const express = require("express");
const path = require("path");
const dayjs = require("dayjs");
const router = express.Router();
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
const gpxParser = require("gpxparser");
const gpx = new gpxParser();
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
  let gpxString = fs.readFileSync(`gpx/${req.file.originalname}`).toString();
  gpx.parse(gpxString);
  let track = gpx.tracks[0];
  let ascent = track.elevation.max - track.elevation.min;
  let length = track.distance.total;
  let track_path = "gpx/" + req.file.originalname;
  let start_pointX = track.points[0]["lat"];
  let start_pointY = track.points[0]["lon"];
  let start_pointA = track.points[0]["ele"];
  let lastNum = track.points.length - 1;
  let end_pointX = track.points[lastNum]["lat"];
  let end_pointY = track.points[lastNum]["lon"];
  let end_pointA = track.points[lastNum]["ele"];
  let max_ele = track.elevation.max;
  let endTime = track.points[lastNum]["time"];
  let startTime = track.points[0]["time"];
  const StartDate = dayjs(startTime);
  const EndDate = dayjs(endTime);
  let expected_time = dayjs.duration(EndDate.diff(StartDate)).format("HH:MM");
  //let expected_minute = dayjs(EndDate.diff(StartDate, "minute"));
  // console.log(req.body.reference_point[0]);
  try {
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });
    const hikeId = await HikeManager.defineHike(
      writer_id,
      track_path,
      req.body.province,
      req.body.city,
      req.body.title,
      length,
      expected_time,
      ascent,
      max_ele,
      req.body.difficulty,
      req.body.description,
      start_pointX,
      start_pointY,
      start_pointA,
      end_pointX,
      end_pointY,
      end_pointA,
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
