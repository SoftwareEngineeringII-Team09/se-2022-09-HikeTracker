"use strict";

const { body, param, validationResult } = require("express-validator");
const HikeManager = require("../controllers/HikeManager");
const HikeRefPointManager = require("../controllers/HikeRefPointManager");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: "./gpx",
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// POST a hike
router.post(
  "/",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
  upload.single("gpx"),
  async (req, res) => {
    const writerId = req.user.userId;
    const fileName = req.file.originalname;
    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty())
        return res.status(422).json({ error: error.array()[0] });

      const hikeId = await HikeManager.defineHike(
        writerId,
        req.body.title,
        req.body.expectedTime,
        req.body.difficulty,
        req.body.description,
        req.body.city,
        req.body.province,
        req.body.region,
        fileName
      );
      return res.status(201).send({ hikeId });
    } catch (exception) {
      const errorCode = exception.code ?? 503;
      const errorMessage =
        exception.result ?? "Something went wrong, please try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);





// PUT the list of reference points for a given hike
router.put(
  "/:hikeId/refPoints",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
  param("hikeId").isInt({ min: 0 }),
  async (req, res) => {
    const hikeId = req.params.hikeId;
    try {
      // Validation of body and/or parameters
      const error = validationResult(req);
      if (!error.isEmpty())
        return res.status(422).json({ error: error.array()[0] });
      
      await HikeRefPointManager.updateRefPoint(
        hikeId,
        req.body.referencePoints,
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

// GET the list of all hikes
router.get("/", async (req, res) => {
  try {
    const hikes = await HikeManager.getAllHikes();
    return res.status(200).json(hikes);
  } catch (exception) {
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? "Something went wrong, try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});

// GET the list of all hikes by writerId
router.get(
  "/writers/:writerId", 
    auth.withAuth,
    auth.withRole(["Local Guide"]),
  param("writerId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid writerId"),
  async (req, res) => {
  try {
    // Validation of body and/or parameters
    const error = validationResult(req);
    if (!error.isEmpty())
      return res.status(422).json({ error: error.array()[0] });

    if (req.params.writerId !== req.user.userId) {
      return res.status(401).json({ error: `The user is not authorized, :writerId ${req.params.writerId} not corresponding to actual userId ${req.user.userId}` });
    }

    const hikes = await HikeManager.getAllHikes().then(hikes => hikes.filter(h => h.writer.writerId === req.params.writerId));
    
    return res.status(200).json(hikes);
  } catch (exception) {
    const errorCode = exception.code ?? 500;
    const errorMessage = exception.result ?? "Something went wrong, try again";
    return res.status(errorCode).json({ error: errorMessage });
  }
});

// GET a hike by hikeId
router.get(
  "/:hikeId",
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });

      const hike = await HikeManager.getHikeById(req.params.hikeId);

      return res.status(200).json(hike);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// GET a hike gpx
router.get(
  "/:hikeId/download",
  auth.withAuth,
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });

      const gpxPath = await HikeManager.getGpxPath(req.params.hikeId);
      return res.download(gpxPath);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// GET potential start and end points
router.get(
  "/:hikeId/potentialStartEndPoints",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });

      const hikeId = req.params.hikeId;
      const potentialStartEndPoints = await HikeManager.getPotentialStartEndPoints(hikeId);

      return res.status(200).json(potentialStartEndPoints);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// GET potential huts
router.get(
  "/:hikeId/linkable-huts",
  // auth.withAuth,
  // auth.withRole(["Local Guide"]),
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });

      const hikeId = req.params.hikeId;
      const potentiaHuts = await HikeManager.getPotentialHuts(hikeId);
    
      return res.status(200).json(potentiaHuts);
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);

// PUT new start and/or end point for the hike
router.put(
  "/:hikeId/startEndPoints",
  auth.withAuth,
  auth.withRole(["Local Guide"]),
  param("hikeId")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Provide a valid hikeId"),
    body("newStartPoint").optional().isObject(), 
    body("newStartPoint.type").optional().isString(), 
    body("newStartPoint.id").optional().isInt({ min: 1 }),
    body("newEndPoint").optional().isObject(),  
    body("newEndPoint.type").optional().isString(), 
    body("newEndPoint.id").optional().isInt({ min: 1 }), 
  async (req, res) => {
    try {
      // Validation of body and/or parameters
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ error: errors.array()[0] });
      
      const hikeId = req.params.hikeId;
      const newStartPoint = req.body.newStartPoint;
      const newEndPoint = req.body.newEndPoint;

      if (newStartPoint) {
        await HikeManager.updateStartPoint(hikeId, newStartPoint);
      }
      if (newEndPoint) {
        await HikeManager.updateEndPoint(hikeId, newEndPoint);
      }

      return res.status(201).end();
    } catch (exception) {
      const errorCode = exception.code ?? 500;
      const errorMessage =
        exception.result ?? "Something went wrong, try again";
      return res.status(errorCode).json({ error: errorMessage });
    }
  }
);



module.exports = router;
