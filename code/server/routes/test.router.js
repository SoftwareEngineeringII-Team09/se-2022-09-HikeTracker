"use strict";

const express = require("express");
const UserManager = require("../controllers/UserManager");
const HikeManager = require("../controllers/HikeManager")
const router = express.Router();
const TestUtils = require("../test/integration-utils");

// POST a hut
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
      const userId = await UserManager.defineUser(
        req.body.role,
        req.body.firstname,
        req.body.lastname,
        req.body.mobile,
        req.body.email,
        req.body.password,
        "TEST_TOKEN"
      )
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
      await HikeManager.defineHike(
        req.body.writerId,
        req.body.title,
        req.body.expectedTime,
        req.body.difficulty,
        req.body.description,
        req.body.city,
        req.body.province,
        req.body.region,
        req.body.filename,
      )
      return res.status(204).end();
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

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
