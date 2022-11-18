"use strict";

const HikeManager = require("../controllers/HikeManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./gpx",
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// POST a hike 
router.post("/writers/:writerId", upload.single("gpx"), async (req, res) => {
  const writerId = req.params.writerId;
  const fileName = req.file.originalname;
  try {
    // Validation of body and/or parameters
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });

    await HikeManager.defineHike(
      writerId,
      req.body.title,
      req.body.expectedTime,
      req.body.difficulty,
      req.body.description,
      req.body.city,
      req.body.province,
      req.body.region,
      fileName
    );
    return res.status(201).end();
  } catch (exception) {
    const errorCode = exception.code ?? 503;
    const errorMessage =
      exception.result ?? "Something went wrong, please try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});

// GET the list of all hikes
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

// GET a hike by hikeId
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

// GET a hike gpx
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

      const gpxPath = await HikeManager.getGpxPath(req.params.hikeId);
      return res.download(gpxPath);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

module.exports = router;
