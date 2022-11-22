"use strict";

const ParkingLotManager = require("../controllers/ParkingLotManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

// POST a parking lot 
router.post("/writers/:writerId",
  param("writerId").isInt({ min: 0 }),
  body("parkingLotName").isString(),
  body("latitude").isFloat({ min: 0 }),
  body("longitude").isFloat({ min: 0 }),
  body("altitude").isFloat({ min: 0 }), 
  async (req, res) => {
    const writerId = req.params.writerId;
    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty())
        return res.status(422).json({ error: error.array()[0] });

      await ParkingLotManager.defineParkingLot(
        writerId,
        req.body.parkingLotName,
        req.body.latitude,
        req.body.longitude,
        req.body.altitude
      );
      return res.status(201).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

module.exports = router;