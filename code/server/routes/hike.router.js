"use strict";

const HikeManager = require('../controllers/HikeManager');
const { body, param, validationResult } = require("express-validator");
const express = require('express');
const router = express.Router();

// Get list of all hikes
router.get('/', async (req, res) => {
  try {
    const hikes = await HikeManager.loadAllHikes();
    return res.status(200).json({ hikes });
  } catch (exception) {
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? 'Something went wrong, try again';
    return res.status(errorCode).json({ error: errorMessage })
  }
})


// Get hike by Id
router.get('/:hikeId', param("hikeId").isInt({ min: 1 }).toInt().withMessage("Provide a valid hikeId"), async (req, res) => {
  try {
    // Validation of body and/or parameters
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array()[0] });

    const hike = await HikeManager.loadHikeById(req.params.hikeId);
    return res.status(200).json({ hike });
  } catch (exception) {
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? 'Something went wrong, try again';
    return res.status(errorCode).json({ error: errorMessage })
  }
})

// Download hike gpx track
router.get('/:hikeId/download', param("hikeId").isInt({ min: 1 }).toInt().withMessage("Provide a valid hikeId"), async (req, res) => {
  try {
    // Validation of body and/or parameters
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array()[0] });

    const gpxFile = await HikeManager.getGpxTrackById(req.params.hikeId);
    return res.download(gpxFile);
  } catch (exception) {
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? 'Something went wrong, try again';
    return res.status(errorCode).json({ error: errorMessage })
  }
})


module.exports = router;