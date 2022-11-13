"use strict";

const HikeManager = require('../controllers/HikeManager');
const { body, param, validationResult } = require("express-validator");
const express = require('express');
const router = express.Router();


// GET /api/hikes
// This route returns the Hike list
app.get('/api/hikes', 
isLoggedIn,               // check if the user is logged-in
(req, res) => {
  // NOTE: user exists for sure otherwise isLoggedIn would fail
  // get hikes that match optional filter in the query
  userDB.listHikes(req.user.id, req.query.filter)
    .then(hikes => res.json(hikes))
    .catch((err) => res.status(500).json(err)); 
});

// GET /api/hikes/<id>
// Given a  hikeId, this route returns the associated hike from the list.
app.get('/api/hikes/:hikeId', 
isLoggedIn,                 
[ check('id').isInt() ],    //validation
async (req, res) => {
    try {
      const result = await userDB.getHike(req.user.id, req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
});


// POST /api/hikes
// This route adds a new hike to list.
app.post('/api/hikes',
isLoggedIn,
[
  check('hikeId').isInt({ min: 0, max: 999 }),    // attributi temporanei
  check('hutId').isInt({ min: 0, max: 999 }),
  check('length').isInt({ min: 0, max: 999 }),
  check('time').isInt({ min: 0, max: 999 }),
], 
async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter); 
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
  }


  const hike = {
    hikeId: req.body.hikeId,
    hutId: req.body.hutId,
    length: req.body.length,
    time: req.body.time,
    user: req.user.id  // user is overwritten with the id of the user that is doing the request and it is logged in
  };  

  try {
    const result = await userDB.createHike(hike); // createHike returns the new created object
    res.json(result); 
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of new hike: ${err}` }); 
  }
});

// PUT /api/hikes/<id>
// This route allows to modify a hike, specifiying its id and the necessary data.
app.put('/api/hikes/:hikeId', 
isLoggedIn,
  [
    check('hikeId').isInt({ min: 0, max: 999 }),
    check('hutId').isInt({ min: 0, max: 999 }),
    check('length').isInt({ min: 0, max: 999 }),
    check('time').isInt({ min: 0, max: 999 }),
  ], 
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter); 
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ")  }); // error message is a single string with all error joined together
    }
  

  if (req.body.id !== Number(req.params.id)) {  // Check if url and body id mismatch
    return res.status(422).json({ error: 'URL and body id mismatch' });
  }

  const hike = {
    hikeId: req.body.hikeId,
    hutId: req.body.hutId,
    length: req.body.length,
    time: req.body.time,
    user: req.user.id // user is overwritten with the id of the user that is doing the request and it is logged in
  };
  

  try {
    const result = await userDB.updateHike(req.user.id, hike.hikeId, hike);
    res.json(result); 
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of hike ${req.params.id}: ${err}` });
  }

});

// DELETE /api/hikes/<id>
// Given a hikeId, this route deletes the associated hike from the list.
app.delete('/api/hikes/:hikeId', 
isLoggedIn,
  [ check('hikeId').isInt() ], 
  async (req, res) => {
  try {
    // if there is no hike with the specified hikeId, the delete operation is considered successful.
    await userDB.deleteHike(req.user.id, req.params.id);
    res.status(200).json({}); 
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of hike ${req.params.id}: ${err} ` });
  }
});


module.exports = router;