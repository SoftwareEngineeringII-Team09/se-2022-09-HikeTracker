"use strict";

const express = require("express");
const UserManager = require("../controllers/UserManager");
const router = express.Router();
const TestUtils = require("../test/integration-utils");

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

module.exports = router;
