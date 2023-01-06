"use strict";

const { body, param, validationResult } = require("express-validator");
const SelectedHikeManager = require("../controllers/SelectedHikeManager");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");



// POST add startTime for a given selectedHIke
router.post(
  "/start",
  auth.withAuth,
  auth.withRole(["Hiker"]),
  body("time").isString(),
  async (req, res) => {

    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty()) 
        return res.status(422).json({ error: error.array()[0] });
      const hikerId = req.user.userId;
      let selectedHikeId = await SelectedHikeManager.startHike(req.body.hikeId, req.body.time, hikerId);
      // if (selectedHikeId.code)
      // return res.status(selectedHikeId.code ).send(selectedHikeId.result);
      // else
      // return res.status(201).send({ selectedHikeId });
      return res.status(201).send({ selectedHikeId });
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);


// GET get startTime for selectedHIke
router.get(
  "/",
  auth.withAuth,
  auth.withRole(["Hiker"]),
  async (req, res) => {
    const hikerId = req.user.userId;
    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty()) 
        return res.status(422).json({ error: error.array()[0] });
      
      
      let selecteHike = await SelectedHikeManager.loadStartedHike(hikerId);
      return res.status(201).send(selecteHike);
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);


// PUT endTime and update status for a given :selectedHIke
router.put(
  "/:selectedHikeId/terminate",
  auth.withAuth,
  auth.withRole(["Hiker"]),
  param("selectedHikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid selectedHikeId"),
  body("time").isString(),
  async (req, res) => {
    const selectedHikeId = req.params.selectedHikeId;
    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty()) 
        return res.status(422).json({ error: error.array()[0] });

      await SelectedHikeManager.terminateHike(selectedHikeId, req.body.time);

      return res.status(201).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

module.exports = router;
