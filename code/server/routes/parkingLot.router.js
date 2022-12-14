"use strict";

const ParkingLotManager = require("../controllers/ParkingLotManager");
const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth')

// POST a parking lot 
router.post("/",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
  body("parkingLotName").isString(),
  body("latitude").isFloat({ min: 0 }),
  body("longitude").isFloat({ min: 0 }),
  body("altitude").optional().isFloat({ min: 0 }),
  body("capacity").isInt({ min: 0 }),
  async (req, res) => {
    const writerId = req.user.userId;
    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty())
        return res.status(422).json({ error: error.array()[0] });

      await ParkingLotManager.defineParkingLot({
        writerId: writerId,
        parkingLotName: req.body.parkingLotName,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        altitude: req.body.altitude ?? null,
        capacity: req.body.capacity
      });

      return res.status(201).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

module.exports = router;