"use strict";

const HutManager = require("../controllers/HutManager");
const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("multer");
const storageImage = multer.diskStorage({
  destination: "./hutImage",
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const uploadImage = multer({
  storage: storageImage,
});



// POST a hut
router.post(
  "/",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
  uploadImage.single("hutImage"),
  body("hutName").isString(),
  body("city").isInt({ min: 0 }),
  body("province").isInt({ min: 0 }),
  body("region").isInt({ min: 0 }),
  body("numOfBeds").isInt({ min: 0 }),
  body("cost").isFloat({ min: 0 }),
  body("latitude").isFloat({ min: 0 }),
  body("longitude").isFloat({ min: 0 }),
  body("altitude").isFloat({ min: 0 }),
  body("phone").isString(),
  body("email").isEmail(),
  body("website").optional().isString(),
  
  async (req, res) => {
   const fileName = req.file.originalname;
   const writerId = req.user.userId;
   
    try {
      const error = validationResult(req);
      if (!error.isEmpty())
        return res.status(422).json({ error: error.array()[0] });
        
      
      const hutId = await HutManager.defineHut({
        hutName: req.body.hutName,
        writerId: writerId,
        city: req.body.city,
        province: req.body.province,
        region: req.body.region,
        numOfBeds: req.body.numOfBeds,
        cost: req.body.cost,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        altitude: req.body.altitude,
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website ?? null,
        fileName: fileName
      });
      
      return res.status(201).send({hutId});
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
  auth.withRole(["Hiker", "Local Guide"]),
  async (req, res) => {
    try {
      const hikes = await HutManager.getAllHuts();
      return res.status(200).json(hikes);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage = exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  });

// GET hut by Id
router.get(
  "/:hutId",
  auth.withAuth,
  auth.withRole(["Hiker", "Local Guide"]),
  async (req, res) => {
    try {
      const hutId = req.params.hutId;
      const hut = await HutManager.getHutById(hutId);
      return res.status(200).json(hut);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

module.exports = router;
