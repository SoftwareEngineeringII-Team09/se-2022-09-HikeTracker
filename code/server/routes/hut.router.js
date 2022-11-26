"use strict";

const HutManager = require("../controllers/HutManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// POST a hut
router.post(
  "/writers/:writerId", 
  auth.withAuth,
  auth.withRole(['Local Guide']),
  param("writerId").isInt({ min: 0 }),
  body("hutName").isString(), 
  body("city").isInt({ min: 0 }), 
  body("province").isInt({ min: 0 }), 
  body("region").isInt({ min: 0 }),
  body("numOfBeds").isInt({ min: 0 }),
  body("cost").isFloat({ min: 0 }), 
  body("latitude").isFloat({ min: 0 }),
  body("longitude").isFloat({ min: 0 }),
  body("altitude").isFloat({ min: 0 }), 
  async (req, res) => {
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
    const errorCode = exception.code ?? 503;
    const errorMessage =
      exception.result ?? "Something went wrong, please try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});

module.exports = router;
