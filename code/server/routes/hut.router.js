"use strict";

const HutManager = require("../controllers/HutManager");
const { body, param, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// POST a hut
router.post(
  "/",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
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
    const writerId = req.user.userId;
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
        req.body.altitude
      );
      return res.status(201).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// GET the list of all huts
router.get(
  "/", 
  auth.withAuth,
  auth.withRole(["Hiker"]), 
  async (req, res) => {
    try {
      const hikes = await HutManager.getAllHuts();
      return res.status(200).json(hikes);
    } catch (exception) {
      console.log(exception);
      const errorCode = exception.code ?? 500;
      const errorMessage = exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

// GET hut by Id
router.get(
  "/:hutId",
  // auth.withAuth,
  // auth.withRole(["Hiker"]), 
  async (req, res) => {
    try {
      const hutId = req.params.hutId;
      const hut = await HutManager.getHutById(hutId);
      //console.log(hut);
      return res.status(200).json(hut);
    } catch (exception) {
      console.log(exception);
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

module.exports = router;
