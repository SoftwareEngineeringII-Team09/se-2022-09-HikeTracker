"use strict";

const express = require("express");
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

module.exports = router;
