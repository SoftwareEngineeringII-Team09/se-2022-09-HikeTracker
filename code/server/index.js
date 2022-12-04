"use strict";

// If the server is not in production, configures usage of
// .env file for environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

//import modules
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const cors = require("cors");
const passport = require("passport");

// import auth middleware to configure authentication functionalities
const auth = require("./middlewares/auth");

// import routers
let testRouter;
if (process.env.NODE_ENV.trim() === "test") {
  testRouter = require("./routes/test.router");
}

const authRouter = require("./routes/auth.router");
const hikeRouter = require("./routes/hike.router");
const hutRouter = require("./routes/hut.router");
const parkingLotRouter = require("./routes/parkingLot.router");
const userRouter = require("./routes/user.router");

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
  origin: `http://localhost:3000`,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: false,
  saveUninitialized: false,
  secret: 'secret'
}))

// Creating the session
//app.use(express.cookieParser('your secret option here'));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

// Setting up server routers
if (process.env.NODE_ENV.trim() === "test")
  app.use(`${API_PREFIX}/tests`, testRouter)

// app.use(`${API_PREFIX}/parkinglots`, parkingLotRouter);
app.use(`${API_PREFIX}/hikes`, hikeRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/huts`, hutRouter);
app.use(`${API_PREFIX}/parkingLots`, parkingLotRouter);
app.use(`${API_PREFIX}/auth`, authRouter);

// Activating the server
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || "development"} on http://localhost:${PORT}/`)
);

module.exports = app;
