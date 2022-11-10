"use strict";

const HikeManager = require('../controllers/HikeManager');
const { body, param, validationResult } = require("express-validator");
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let hikes = await HikeManager.loadAllHikes();
    console.log(hikes);
    return res.status(200).json({ hikes });
  } catch (exception) {
    console.log(exception);
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? 'Something went wrong, try again';
    return res.status(errorCode).json({ error: errorMessage })
  }
})

module.exports = router;