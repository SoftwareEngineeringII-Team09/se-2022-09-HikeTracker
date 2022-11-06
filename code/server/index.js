"use strict";

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const SERVER_PORT = 3001;
const CLIENT_PORT = 3000;
const API_PREFIX = '/api';
const app = new express();


/* HTTP logger middleware, don't log during integration tests */
app.use(logger("combined", { skip: () => process.env.NODE_ENV === 'test' }));

/* JSON */
app.use(express.json());

/* CORS */
app.use(cors({
    origin: `http://localhost:${CLIENT_PORT}`,
    credentials: true
}));

/* ROUTES */
const parkingLotRouter = require('./routes/parkinglot.router');
const hikeRouter = require('./routes/hike.router');
const userRouter = require('./routes/user.router');
const hutRouter = require('./routes/hut.router');

app.use(`${API_PREFIX}/parkinglots`, parkingLotRouter);
app.use(`${API_PREFIX}/hikes`, hikeRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/huts`, hutRouter);


/* Serve requests */
app.listen(SERVER_PORT, () => {
    console.log(`Server listening at http://localhost:${SERVER_PORT}`);
});


module.exports = app;