"use strict";

const express = require("express");
const UserManager = require("../controllers/UserManager");
const HikeManager = require("../controllers/HikeManager")
const HutManager = require("../controllers/HutManager");
const ParkingLotManager = require("../controllers/ParkingLotManager");
const router = express.Router();
const TestUtils = require("../test/integration-utils");
const SelectedHikeManager = require("../controllers/SelectedHikeManager");
const SelectedHike = require("../dao/model/SelectedHike");
const PersistentManager = require("../dao/PersistentManager");

router.delete(
  "/clearAll",
  async (req, res) => {
    try {
      await TestUtils.clearAll();

      return res.status(204).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

router.post(
  "/addUser",
  async (req, res) => {
    try {
      const userId = await UserManager.defineUser({
        role: req.body.role,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        mobile: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
        verificationCode: "TEST_TOKEN"
      });
      await UserManager.verifyEmail(userId, "TEST_TOKEN");
      return res.status(204).send({ userId });
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

router.post(
  "/addHike",
  async (req, res) => {
    try {
      await HikeManager.defineHike(req.body)
      return res.status(204).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

router.post(
  "/addHut",
  async (req, res) => {
    try {
      await HutManager.defineHut(req.body)
      return res.status(204).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

router.post(
  "/addParkingLot",
  async (req, res) => {
    try {
      await ParkingLotManager.defineParkingLot(req.body)

      return res.status(204).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

router.post(
  "/addCompletedSelectedHike",
  async (req, res) => {
    console.log(req)
    try {
      await PersistentManager.store(SelectedHike.tableName, new SelectedHike(req.body.selectedHikeId, req.body.hikeId, req.body.hikerId, req.body.status, req.body.startTime, req.body.endTime));
      return res.status(204).end();
    } catch (exception) {
      console.log(exception)
      const errorCode = exception.code ?? 503;
      const errorMessage = exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// router.post(
//   "/verifyUser",
//   async (req, res) => {
//     try {
//       const user = UserManager.loadAllByAttributeUser('userId', req.body.userId)
//       await UserManager.verifyEmail(req.body.userId, user.token);
//       return res.status(204).end();
//     } catch (exception) {
//       const errorCode = exception.code ?? 503;
//       const errorMessage =
//         exception.result ?? "Something went wrong, please try again";
//       return res.status(errorCode).json({ error: errorMessage });
//     }
// });
module.exports = router;
