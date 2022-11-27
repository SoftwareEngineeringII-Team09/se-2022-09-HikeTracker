"use strict";

// If the server is not in production, configures usage of
// .env file for environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//import modules
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const { check, validationResult, body, param } = require("express-validator"); // validation middleware
const passport = require("passport");

// import auth middleware to configure authentication functionalities
const auth = require("./middlewares/auth");

// import routers
const hikeRouter = require("./routes/hike.router");
const hutRouter = require("./routes/hut.router");
const parkingLotRouter = require("./routes/parkingLot.router");
const userRouter = require("./routes/user.router");
const authRouter = require("./routes/auth.router");
const { use } = require("chai");

const SERVER_PORT = 3001;
const CLIENT_PORT = 3000;
const API_PREFIX = "/api";
const PORT = 3001;

// authentication functionalities initialization
auth.useLocal();
auth.serializeUser();
auth.deserializeUser();

// server modules
const app = express();
app.use(logger("dev"));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: true,
      maxAge: 60000,
    },
  })
);

// Creating the session
//app.use(express.cookieParser('your secret option here'));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

// Setting up server routers
// app.use(`${API_PREFIX}/parkinglots`, parkingLotRouter);
app.use(`${API_PREFIX}/hikes`, hikeRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/huts`, hutRouter);
app.use(`${API_PREFIX}/parkingLots`, parkingLotRouter);
app.use(`${API_PREFIX}/auth`, authRouter);

/*** Defining authentication verification middleware ***/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

// GET /api/filters
// This route returns the list of filters
app.get("/api/filters", (req, res) => {
  // When the "filters" object is serialized through this method, filter functions are not serialized.
  res.json(userDB.listFilters());
});

// Activating the server

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

module.exports = app;
