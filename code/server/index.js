"use strict";

// If the server is not in production, configures usage of
// .env file for environment variables
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }

//import modules
const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");

// import auth middleware to configure authentication functionalities
const auth = require("./middlewares/auth");

// import routers
const authRouter = require("./routes/auth.router");
const hikeRouter = require("./routes/hike.router");
const hutRouter = require("./routes/hut.router");
const parkingLotRouter = require("./routes/parkingLot.router");
const userRouter = require("./routes/user.router");

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
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

// Creating the session
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate("session"));

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Setting up server routers
// app.use(`${API_PREFIX}/parkinglots`, parkingLotRouter);
app.use(`${API_PREFIX}/hikes`, hikeRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/huts`, hutRouter);
app.use(`${API_PREFIX}/parkingLots`, parkingLotRouter);
app.use(`${API_PREFIX}/auth`, authRouter);

// Activating the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

module.exports = app;
