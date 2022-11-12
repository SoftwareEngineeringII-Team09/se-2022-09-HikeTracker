'use strict';

// If the server is not in production, configures usage of
// .env file for environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//import modules
const express = require('express');
const logger = require('morgan'); 
const cors = require('cors');
const session = require('express-session');
const { check, validationResult, body, param } = require('express-validator'); // validation middleware
const userDB = require('./db');

// import auth middleware to configure authentication functionalities
const auth = require('./middlewares/auth');

// import routers
const hikeRouter = require('./routes/hike.router');
const hutRouter = require('./routes/hut.router');
const parkingRouter = require('./routes/parkinglot.router');
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');
const { use } = require('chai');

// authentication functionalities initialization
auth.useLocal();
auth.serializeUser();
auth.deserializeUser();

// server modules
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

// Creating the session
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:3000',   
  credentials: true,
};
app.use(cors(corsOptions));

// Setting up server routers
app.use("/hike", hikeRouter);
app.use("/hut", hutRouter);
app.use("/parkingLot", parkingRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

/*** Defining authentication verification middleware ***/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


/*** Users APIs ***/

// POST /api/sessions 
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.json(req.user);
      });
  })(req, res, next);
});


// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});


// GET /api/filters
// This route returns the list of filters 
app.get('/api/filters', 
(req, res) => {
  // When the "filters" object is serialized through this method, filter functions are not serialized.
  res.json(userDB.listFilters())
});

/*** Hikes APIs ***/

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


// Activating the server
const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
