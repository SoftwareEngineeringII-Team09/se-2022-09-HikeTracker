![tests workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/tests.yml/badge.svg)

<!-- ![sonarcloud analysis workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/sonarcloud.yml/badge.svg) -->

![docker build workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/docker-build.yml/badge.svg)

---

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-orange.svg)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=bugs)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=SoftwareEngineeringII-Team09_se-2022-09-HikeTracker)

---

This project has been developed by Team-09 for the course of "Software Engineering II", attended during the academic year 2022/23 at Politecnico di Torino, Master's Degree in Computer Engineering.

## Table of Contents

1. [Docker Documentation](#docker-documentation)
   - [How to pull production from Docker Hub](#how-to-pull-production-from-docker-hub)
   - [How to run the production](#how-to-run-the-production)
   - [How to run in development mode](#how-to-run-in-development-mode)
   - [How to run tests](#how-to-run-tests)
   - [Deploy on Docker Hub](#deploy-on-Docker-Hub)
2. [Technical Dept Strategy](#technical-dept-strategy)
3. [Technologies](#technologies)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Database](#database)
4. [React Client Application Routes](#react-client-application-routes)
    - [Route `/`](#index-route)
    - [Route `/hikes`](#index-route)
    - [Route `/hikes/:hikeId`](#hikeshikeid)
    - [Route `/signup`](#signup)
    - [Route `/login`](#login)
    - [Route `/activate`](#activate)
    - [Route `/account/hikes`](#accounthikes)
    - [Route `/account/hikes/add`](#accounthikesadd)
    - [Route `/account/hikes/:hikeId/update/reference-points`](#accounthikeshikeidupdatereference-points)
    - [Route `/account/hikes/:hikeId/update/endpoints`](#accounthikeshikeidupdateendpoints)
    - [Route `/account/huts/add`](#accounthutsadd)
    - [Route `/account/parking-lots/add`](#accountparking-lotsadd)
    - [Route `/*`](#page-not-found-route)
5. [API Server](#api-server)
    - [Session Routes](#session-routes)
	    - [`POST /api/auth/signup`](#post-apiauthsignup)
	    - [`PUT /api/auth/sendVerificationCode`](#put-apiauthsendverificationcode)
	    - [`PUT /api/auth/verifyEmail`](#put-apiauthverifyemail)
	    - [`POST /api/auth/login/password`](#post-apiauthloginpassword)
	    - [`DELETE /api/auth/logout`](#delete-apiauthlogout)
	    - [`GET /api/auth/current`](#get-apiauthcurrent)
    - [Hike Routes](#hike-routes)
	    - [`POST /api/hikes`](#post-apihikes)
	    - [`GET /api/hikes`](#get-apihikes)
	    - [`GET /api/hikes/:hikeId`](#get-apihikeshikeid)
	    - [`GET /api/hikes/:hikeId/download`](#get-apihikeshikeiddownload)
	    - [`POST /api/hikes/refPoints/:hikeId`](#post-apihikesrefpointshikeid)
       - [`GET /api/hikes/writers/:writerId`](#get-apihikeswriterswriterid)
       - [`GET /api/hikes/:hikeId/potentialStartEndPoints`](#get-apihikeshikeidpotentialstartendpoints)
       - [`GET /api/hikes/:hikeId/linkable-huts`](#get-apihikeshikeidlinkable-huts)
       - [`PUT /api/hikes/:hikeId/refPoints`](#put-apihikeshikeidrefpoints)
       - [`PUT /api/hikes/:hikeId/startEndPoints`](#put-apihikeshikeidstartendpoints)
       - [`PUT /api/hikes/:hikeId/huts`](#put-apihikeshikeidhuts)
    - [Hut Routes](#hut-routes)
	    - [`POST /api/huts`](#post-apihuts)
	    - [`GET /api/huts`](#get-apihuts)
       - [`GET /api/huts/:hutId`](#get-apihutshutid)
    - [ParkingLot Routes](#parkinglot-routes)
	    - [`POST /api/parkingLots`](#post-apiparkinglots)
    - [SelectedHike Routes](#selectedhike-routes)
       - [`POST /api/selectedHikes/start`](#post-apiselectedhikesstart)
	    - [`PUT /api/selectedHikes/:selectedHikeId/terminate`](#put-apiselectedhikesselectedhikeidterminate)
       - [`GET /api/selectedHikes`](#get-apiselectedhikes)]
6. [Database Tables](#database-tables)
    - [Table `User`](#user)
    - [Table `Hike`](#hike)
    - [Table `Point`](#point)
    - [Table `Hut`](#hut)
    - [Table `HutDailySchedule`](#hutdailyschedule)
    - [Table `HikeHut`](#hikehut)
    - [Table `ParkingLot`](#parkinglot)
    - [Table `HikeParkingLot`](#hikeparkinglot)
    - [Table `HikeRefPoint`](#hikerefpoint)
    - [Table `SelectedHike`](#selectedhike)
7. [Testing](#testing)
   - [Testing Frontend](#testing-frontend)
   - [Testing Backend](#testing-backend)
8. [Mocks](#mocks)

## Docker Documentation

If you don't have access to the source code, you are able to pull production images for client and server and to run the production application.
To see how to pull and run the production, take a look to:
-  [How to pull production from Docker Hub](#how-to-pull-production-from-Docker-Hub)
-  [How to run the production](#how-to-run-the-production)

On the other hand, if you have access to the source code, you are also able to run the application in development mode and to run both client and server tests.
To see the available commands, take a look also to:
- [How to run in development mode](#how-to-run-in-development-mode)
- [How to run tests](#how-to-run-tests)

### How to pull production from Docker Hub

This repo has two images, one for the user interface and one for the server logic. 

#### No source code
Both images can be pulled with:

```
docker pull andreadeluca/se_2022_09_hike_tracker:client
docker pull andreadeluca/se_2022_09_hike_tracker:server
```

#### With source code using `docker-compose`

_You must be in `/code` to be able to run this command._

Both images can be pulled with:

```
docker-compose -f docker-compose.prod.yml pull 
```

### How to run the production

Once you have pulled the production, you are able to run the application (see [How to pull production from Docker Hub](#how-to-pull-production-from-docker-hub)).

#### No source code

To run the application, you should use:

```
docker run -d -p 3001:3001 --name se09-server andreadeluca/se_2022_09_hike_tracker:server
docker run -d -p 80:80 --name se09-client --link se09-server:server andreadeluca/se_2022_09_hike_tracker:client
```

The application will be reached to `http://localhost:80`, or `http://localhost`

Note:
- the images se09-client depends on the se09-server one, so this must be run first
- in case of name conflicts, remove the containers with `docker rm <name>` and run again the commands above

#### With source code using `docker-compose`

_You must be in `/code` to be able to run this command._

To run the application, you should use:

```
docker-compose -f docker-compose.prod.yml stop && docker-compose -f docker-compose.prod.yml up --build -d
```

the `-f` flag is for custom docker file path

### How to run in development mode

_You must be in `/code` to be able to run this command._

This command allows to run both client and server in development mode.

```
docker-compose up
```

### How to run tests

_You must be in `/code` to be able to run this command._

You can run both frontend unit tests and backend unit and integrations tests with commands:

```
docker-compose -f docker-compose.test.yml run --rm client-tests
docker-compose -f docker-compose.test.yml run --rm server-tests
```

_You can also use just one of them to run what you prefer._

Moreover, if you want to run just one between backend unit tests and integration tests, you can use: 

```
docker-compose -f docker-compose.test.yml run --rm server-unit-tests
docker-compose -f docker-compose.test.yml run --rm server-integration-tests
```

### Deploy on Docker Hub

_You must be in `/code` to be able to run this command._

Be sure that the .env file is in `/server` and in `/code` directory

```
docker login
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push
```

## Technical Debt Strategy

We made repo analysis with Sonarcloud, that allows us to track security issues, code smells and some other useful info you may see above.

Code smells are solved by Severity level: Blocker, Critical, Major, Minor.

## Technologies

### Frontend

The language used is `Javascript` and the framework choosen is `ReactJS`.

Here the list of dependencies installed:

```json
"dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "formik": "^2.2.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^9.1.1",
    "web-vitals": "^2.1.4",
    "yup": "^0.32.11",
    "babel-plugin-transform-class-properties": "^6.24.1"
},
"devDependencies": {
    "@craco/craco": "^7.0.0",
    "@cypress/code-coverage": "^3.10.0",
    "@cypress/instrument-cra": "^1.4.0",
    "@testing-library/cypress": "^8.0.7",
    "@testing-library/dom": "^8.19.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react-toastify": "^4.1.0",
    "autoprefixer": "^10.4.12",
    "axios": "^1.1.3",
    "babel-plugin-istanbul": "^6.1.1",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "bootstrap": "^5.2.2",
    "classnames": "^2.3.2",
    "cypress": "^11.1.0",
    "cypress-dark": "^1.8.3",
    "cypress-file-upload": "^5.0.8",
    "dayjs": "^1.11.7",
    "geolib": "^3.3.3",
    "history": "^5.3.0",
    "leaflet": "^1.9.2",
    "leaflet-topography": "^0.2.1",
    "nyc": "^15.1.0",
    "postcss-preset-env": "^7.8.2",
    "react-app-alias": "^2.2.2",
    "react-bootstrap": "^2.5.0",
    "react-datetime-picker": "^4.1.1",
    "react-icons": "^4.6.0",
    "react-leaflet": "^4.1.0",
    "react-router-dom": "^6.4.3",
    "react-timer-hook": "^3.0.5",
    "regenerator-runtime": "^0.13.11",
    "sass": "^1.55.0",
    "yup-password": "^0.2.2"
}
```

### Backend

The language used is `Javascript` and the framework choosen is `ExpressJS`.

Here the list of dependencies installed:

```json
"dependencies": {
   "cors": "^2.8.5",
   "crypto": "^1.0.1",
   "crypto-js": "^4.1.1",
   "dayjs": "^1.11.5",
   "dotenv": "^16.0.3",
   "express": "^4.18.2",
   "express-session": "^1.17.3",
   "express-validator": "^6.14.2",
   "geodist": "^0.2.1",
   "gpxparser": "^3.0.8",
   "index-of-regex": "^1.0.0",
   "memorystore": "^1.6.7",
   "morgan": "^1.10.0",
   "multer": "^1.4.5-lts.1",
   "node-fetch": "^2.6.7",
   "nodemailer": "^6.8.0",
   "nodemailer-smtp-transport": "^2.7.4",
   "nodemon": "^2.0.20",
   "nyc": "^15.1.0",
   "passport": "^0.6.0",
   "passport-local": "^1.0.0",
   "random-words": "^1.2.0",
   "sqlite3": "^5.1.2",
   "supertest": "^6.3.1"
},
  "devDependencies": {
   "babel": "^6.23.0",
   "chai": "^4.3.6",
   "chai-http": "^4.3.0",
   "check-code-coverage": "^1.10.0",
   "cross-env": "^7.0.3",
   "jest": "^27.5.1",
   "mocha": "^9.2.2",
   "mochawesome": "^7.1.3",
   "mochawesome-report-generator": "^6.2.0"
}
```

### Database

We've choosen a relational database and the DBMS choosen is `SQLite3`.

For more info about the database structure, see [Database Tables](#database-tables).

## React Client Application Routes

### Index Route `/`

_This is the index route_

Homepage for visitor users (not logged in users).

_This route is unprotected from the user authentication._

### `/hikes`

The page shows to any type of user the list of available hikes and main info for each of them.

_This route is unprotected from the user authentication._

### `/hikes/:hikeId`

The page shows more details for the selected hike. Moreover, a map, that allows user to see the track and some useful markers, and a button, that allows user to download `.gpx` file, are shown only if the user is logged in.

_This route is unprotected from the user authentication, but for some features it is required._

### `/login`

The page allows user to perform login with his email address and password, used during registration.

_This route is reachable only by users that are not already logged in._

### `/signup`

The page allows user to signup to the application providing a valid email address and a password. The form asks also for the type of user is going to signup, e.g. Hiker, Local Guide or Hut Manager.

Personal info, i.e. firstname, lastname and mobile phone, are required only if user role is not Hiker.

When valid data are submitted, an email with an activation link is sent to the user's email address.

_This route is reachable only by users that are not logged in._

### `/activate`

#### Route parameters:

- `id`: The identifier of the account to activate
- `token`: the randomly generated string needed to confirm the possession of the email address used during the registration process.

When the user clicks on the activation link sent by email, he is redirected to this page, where a request to activate the account is sent. At the end, the page shows the response to the user.

_This route is reachable only by users that are not logged in._

### `/account/hikes`

The page shows the list of hikes created by the logged in local guide, a button allowing user to create a new hike and some buttons, for each hike, allowing user to update the hike.

_This route is protected and the user must be logged in as a local guide to navigate here._

### `/account/hikes/add`

The page allows a local guide to create a new hike adding useful deatils and uploading an associated `.gpx` file.

When an hike is correctly added, the user is redirected to [the page that allows him to update the reference points for that hike](#accountreference-pointsupdate).

_This route is protected and the user must be logged in as a local guide to navigate here._

### `/account/hikes/:hikeId/update/reference-points`

The page allows a local guide to update the reference points for an hike.

_This route is protected and the user must be logged in as a local guide to navigate here._

### `/account/hikes/:hikeId/update/endpoints`

The page show a map with the current start and end point of a hike, as well as all possibile Huts and Parking lots that can be set as the new start or end point of the hike. This page allows the local guide to set new endpoints for the hike.

_This route is protected and the user must be logged in as a local guide to navigate here._

### `/account/huts/add`

The page allows a local guide to create a new hut adding some useful details.

_This route is protected and the user must be logged in as a local guide to navigate here._

### `/account/parking-lots/add`

The page allows a local guide to create a new parking lot adding some useful details.

_This route is protected and the user must be logged in as a local guide to navigate here._

### Page Not Found Route `/*`

Any other route is matched by this one where the application shows an error.

## API Server

### **Session Routes**

#### `POST /api/auth/signup`

Register a new user.

**Request header:**

`Content-Type: application/json`

**Request body:**

A JSON containing user information. `firstname`, `lastname` and `mobile` are necessary only when `role` is _Hut Worker_ or _Local Guide_.

```json
{
	"email": "mariorossi@email.com",
	"password": "Password",
	"role": "Local Guide",
	"firstname": "Mario",
	"lastname": "Rossi",
	"mobile": "391234567890"
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**

The userId of the created user.

```json
{
   5
}
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

#### `PUT /api/auth/sendVerificationCode`

Generate and send by email a new verification code for the user to activate his account.

**Request header:**

`Content-Type: application/json`

**Request body:**

A JSON containing the `userId` of the user.

```json
{
	"userId": 5
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**

`None`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

#### `PUT /api/auth/verifyEmail`

Verify the registered user to activate his account.

**Request header:**

`Content-Type: application/json`

**Request body:**

A JSON containing the `userId` of the user and the received `token`.

```json
{
	"userId": 5,
	"token": "random-token"
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**

`None`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

#### `POST /api/auth/login/password`

Perform user login.

**Request header:**

`Content-Type: application/json`

**Request body:**

A JSON containing the `username` and the `password` of the user.

```json
{
	"username": "mariorossi@email.com",
	"password": "Password1234."
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**

```json
{
	"userId": 5,
	"email": "mariorossi@email.com",
	"firstname": "Mario",
	"lastname": "Rossi",
	"mobile": "391234567890",
	"role": "Local Guide",
	"active": 1
}
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `DELETE /api/auth/logout`

Perform user logout.

**Request header:**

`Content-Type: application/json`

**Request body:**

`None`

**Response header**

`HTTP status code 204 No Content (success).`

**Response body**

`None`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)

#### `GET /api/auth/current`

Get the current session of a user.

**Request header:**

`Content-Type: application/json`

**Request body:**

`None`

**Response header**

`HTTP status code 200 OK(success)`

**Response body**

`None`

**Error responses**

- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

### **Hike Routes**

#### `POST /api/hikes`

Post a new hike.

**Request header:**

`Content-Type: application/json`

**Request body:**

A gpx file with a JSON object containing hike information.

```json
{
	"province": 4,
	"city": 23,
	"difficulty": "Hiker",
	"description": "This is description"
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**

```json
{
	"province": 4,
	"city": 23,
	"difficulty": "Hiker",
	"description": "This is description"
}
```

**Permission allowed**

`Local Guide`

**Error responses**

- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `GET /api/hikes/`

Get all the hikes.

**Request header:**

`None`

**Response header**

`HTTP status code 200 OK`

**Request body**

```json
[
   {
      "hikeId": 1,
      "title": "Trail for Mont Ferra",
      "writer": " Mario Rossi",
      "city": 1,
      "province": 1,
      "region": 1,
      "length": 13,
      "expectedTime":{
         "hours": "05",
         "minutes": "30"
      },
      "ascent": 1290,
      "maxElevation": 3094,
      "difficulty": "Hiker",
      "description": "This is the description",
      "startPoint": {
         "coords": [
            44.125215216512,
            7.5734655851987
         ]
      },
	}
   ,...
]
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)

#### `GET /api/hikes/:hikeId`

Get a hike by hikeId.

**Request header:**

`Content-Type: application/json`

`Params: req.params.hikeId`

**Request body**

`None`

**Response header**

`HTTP status code 200 OK`

**Response body**

```json
{
   "hikeId": 1,
   "title": "Trail for Mont Ferra",
   "writer": " Mario Rossi",
   "city": 1001,
   "province": 2,
   "region": 1,
   "length": 12,
   "expectedTime":{
      "hours": "05",
      "minutes": "30"
   },
   "ascent": 1290,
   "maxElevation": 3094.13,
   "difficulty": "Hiker",
   "description": "This is description",
   "startPoint":{
      "name": "Start point of Trial to Rocca Patanua",
      "coords": [
         44.125215216512,
         7.5734655851987
      ]
   },
   "endPoint":{
      "name":" End point of Trial to Rocca Patanua",
      "coords": [
         45.678595216512,
         7.5678955851987
      ]
   },
   "referencePoints": {
      "name": "Max elevation point of Trial to Monte Ferra",
      "coords": [
         44.459115216512,
         7.3987655851987
      ]
   },
   "track": [
      [
         44.591215216512,
         7.53219555851987
      ],
      [
         45.37899215216512,
         7.210521655851987
      ],
      ...
   ]
}
```

**Error responses:**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

#### `GET /api/hikes/:hikeId/download`

Get gpx file according to the hike Id.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hikeId to retrieve the id of the hike.`

**Response body:**
`None`

**Response header:**

- `HTTP status code 200 OK`
  `file requested from frontend`

**Error responses:**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

#### `POST /api/hikes/refPoints/:hikeId`

Post a reference point of specific hike

**Request header:**

`Content-Type: application/json`

`Params: req.params.hikeId to retrieve the id of the hike.`

**Request body:**

JSON object containing reference point information of specific hike.

```json
{
   "referencePoints":[
      {
         "name": "refName1",
         "coords": [12334.555,123.5675]
      },
      {
         "name": "refName2",
         "coords": [563.3452,8564.345234]
      },
      ...
   ]
}
```

**Response header:**

- `HTTP status code 201 Created(success)`

**Response body**
`None`

**Permission allowed**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `GET /api/hikes/writers/:writerId`

Get the hikes of a specific writer.

**Request header:**
`Content-Type: application/json`
`Params: req.params.writerId of the writer.`

**Request body:**
`None`

**Response header**

- `HTTP status code 200 OK`

**Response body:**

```json
{
   [
      {
         "hikeId": 1,
         "title": "Trail to Monte Ferra",
         "writer": {
            "writerId": 2,
            "writerName": "Mario Rossi"
         },
         "city": 4017,
         "province": 4,
         "region": 1,
         "length": 13.1,
         "expectedTime": {
            "hours": "01",
            "minutes": "20"
         },
         "ascent": 237.7,
         "maxElevation": 3094.14,
         "difficulty": "Professional hiker",
         "description": "Hike decription",
         "startPoint": {
            "coords": [
               44.57425086759031,
               6.982689192518592
            ]
        }
      },
      {
         "hikeId": 2,
         "title": "Trail to Rocca Patanua",
         "writer": {
            "writerId": 2,
            "writerName": "Mario Rossi"
         },
         "city": 1093,
         "province": 1,
         "region": 1,
         "length": 9.2,
         "expectedTime": {
            "hours": "03",
            "minutes": "00"
         },
         "ascent": 985.3,
         "maxElevation": 2352.9619286962,
         "difficulty": "Hiker",
         "description": "Hike description",
         "startPoint": {
            "coords": [
               45.14908790588379,
               7.237061262130737
            ]
         }
      },
      ...
   ]
}
```

**Permission allowed**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `GET /api/hikes/:hikeId/potentialStartEndPoints`

Get the potential start and end points for a specific hike.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hikeId of the hike.`

**Request body:**
`None`

**Response header:**

- `HTTP status code 200 OK`

**Response body:**

```json
{
	"potentialStartPoints": [
		{
			"type": "hut",
			"id": 4,
			"name": "Rifugio Lou Saret'",
			"coords": [44.57736621029435, 6.999171627929085]
		},
		{
			"type": "parking lot",
			"id": 2,
			"name": "Monte Ferra Parking 2",
			"coords": [44.5749908675903, 6.98998919251859]
		}
	],
	"potentialEndPoints": [
		{
			"type": "parking lot",
			"id": 1,
			"name": "Monte Ferra Parking 1",
			"coords": [44.5799508675903, 6.98408919299859]
		},
		{
			"type": "parking lot",
			"id": 3,
			"name": "Monte Ferra Parking 3",
			"coords": [44.5749939993593, 6.98269703999564]
		}
	]
}
```

**Permission allowed:**
`Local Guide, Manager`

**Error responses:**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `GET /api/hikes/:hikeId/linkable-huts`

Get the linkable huts for a specific hike.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hikeId of the hike.`

**Request body:**
`None`

**Response header:**

- `HTTP status code 200 OK`

**Response body:**

```json
{
	"potentialHuts": [
		{
			"hutId": 1,
			"hutName": "Rifugio Meleze'",
			"pointId": 1,
			"writerId": 2,
			"city": 4017,
			"province": 4,
			"region": 1,
			"numOfBeds": 50,
			"cost": 50,
			"altitude": 1757.43,
			"phone": "0175 956410",
			"email": "meleze@meleze.it",
			"website": "www.meleze.it",
			"type": "start point",
			"parkingLot": 0,
			"hut": 1,
			"nameOfLocation": null,
			"latitude": 44.57425086759031,
			"longitude": 6.982689192518592
		},
		{
			"hutId": 4,
			"hutName": "Rifugio Lou Saret'",
			"pointId": 22,
			"writerId": 2,
			"city": 4017,
			"province": 4,
			"region": 1,
			"numOfBeds": 80,
			"cost": 70,
			"altitude": 1756.76,
			"phone": "347 975 3899",
			"email": "lousaret@libero.it",
			"website": "www.agriturismolousaret.it",
			"type": "hut",
			"parkingLot": 0,
			"hut": 1,
			"nameOfLocation": null,
			"latitude": 44.57736621029435,
			"longitude": 6.999171627929085
		}
	]
}
```

**Permission allowed:**
`Local Guide, Manager`

**Error responses:**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `PUT /api/hikes/:hikeId/refPoints`

Update reference points for a specific hike.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hikeId of the hike.`

**Request body:**

```json
{
   "referencePoints": [
      {
         "name": "view",
         "coords": [44.521, 6.534]
      },
      {
         "name": "fountain",
         "coords": [45.864, 7.924]
      },
      ...
   ]
}
```

**Response header:**

- `HTTP status code 201 Created(success)`

**Response body:**
`None`

**Permission allowed:**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `PUT /api/hikes/:hikeId/startEndPoints`

Update start and/or end point for a specific hike.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hikeId of the hike.`

**Request body:**

```json
{
   "newStartPoint": [
      {
         "type": "hut",
         "id": 1
      },
      {
         "type": "parking lot",
         "id": 2
      },
      ...
   ]
}
```

**Response header:**

- `HTTP status code 201 Created(success)`

**Response body:**
`None`

**Permission allowed:**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `PUT /api/hikes/:hikeId/huts`

Update huts for a specific hike.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hikeId of the hike.`

**Request body:**

```json
{
   [
      1,
      2,
      5,
      10,
      ...
   ]
}
```

**Response header:**

- `HTTP status code 201 Created(success)`

**Response body:**
`None`

**Permission allowed:**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

### **Hut Routes**

#### `POST /api/huts`

Post a new hut associated to the existed writer with an empty of reference point.

**Request body:**

`Content-Type: application/json`

`Params: req.params.writerId to retrieve the id of the writer.`

`Body: a JSON object containing hut information.`

```json
{
	"hutName": "hutName3",
	"WriterId": 7,
	"city": 4017,
	"province": 2,
	"region": 1,
	"numberOfBeds": 50,
	"cost": 20,
	"latitude": 123,
	"longitude": 231,
	"altitude": 343.234234
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**
`None`

**Permission allowed**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)

#### `GET /api/huts/`

Get all huts

**Request body:**

`Content-Type: application/json`

`Body: none`

**Response header**

`HTTP status code 201 Created(success)`

**Response body**

```json
[{
   "hutId": 1,
   "hutName": "Rifugio Blitz",
   "pointId": 5,
   "city":4017,
   "province":4,
   "region":1,
   "numOfBeds": "60",
   "cost": 60,
   "latitude": 46.147128,
   "longitude":8.534505,
   "altitude":1265.850139,
   "schedule":[
      {"day":1,
      "openTime": 8,
      "closeTime":22,
      },
       {"day":2,
      "openTime": 8,
      "closeTime":22,
      },...
   ]

 }
,...
]
```

**Error responses**

- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

#### `GET /api/huts/:hutId`

Get a specific hut by Id.

**Request header:**
`Content-Type: application/json`
`Params: req.params.hutId of the hut.`

**Request body:**
`None`

**Response header:**

- `HTTP status code 200 OK`

**Response body:**

```json
{
	"hut": {
		"hutId": 1,
		"hutName": "HutName",
		"pointId": 1,
		"writerId": 2,
		"city": 1013,
		"province": 1,
		"region": 1,
		"numOfBeds": 50,
		"cost": 50.0,
		"altitude": 1860.12,
		"phone": "39012345678",
		"email": "hutemail@gmail.com",
		"website": "www.hutwebsite.it"
	},
	"point": {
		"pointId": 1,
		"type": "hut",
		"parkingLot": 0,
		"hut": 1,
		"nameOfLocation": null,
		"latitude": 44.124521,
		"longitude": 6.587514
	}
}
```

**Permission allowed:**
`Local Guide, Hiker, Manager`

**Error responses:**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)


### **ParkingLot Routes**

#### `POST /api/parkingLots`

Post a new parking lot.

**Request body:**

`Content-Type: application/json`

`Body: a JSON object containing hut information.`

```json
{
	"parkingLotName": "hutName3",
	"latitude": 123,
	"longitude": 231,
	"altitude": 343.234234
}
```

**Response header**

`HTTP status code 201 Created(success)`

**Response body**
`None`

**Permission allowed**
`Local Guide, Manager`

**Error responses**

- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)


### **SelectedHike Routes**

#### `POST /api/selectedHikes/start`

A hiker start a hike with specific startTime

**Request header:**
`Content-Type: application/json`


**Request body:**
```json
{ 
    "hikeId": 1,
    "time": "2/1/2022, 14:25:34" 
}
```

**Response header:**
- `HTTP status code 201 Created(success)`

**Response body:**
`None`

**Permission allowed:**
`Hiker, Manager`

**Error responses**
- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)



#### `PUT /api/selectedHikes/:selectedHikeId/terminate`

Update status and endTime for a specific selected hike.

**Request header:**
`Content-Type: application/json`
`Params: req.params.selectedHikeId of the selected hike.`

**Request body:**
```json
{
   "time": "3/1/2023, 14:25:34"
}
```

**Response header:**
- `HTTP status code 201 Created(success)`

**Response body:**
`None`

**Permission allowed:**
`Hiker, Manager`

**Error responses**
- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)


#### `GET /api/selectedHikes/`

Retrive the hike which already started

**Request header:**
`Content-Type: application/json`


**Request body:**
`None`

**Response header:**
- `HTTP status code 200 OK`

**Response body:**
```json
{ 
    "selectedHikeId": 1,
    "hikeId":1,
    "startTime": "2/1/2022, 14:25:34" 
}
```

**Permission allowed:**
`Hiker, Manager`

**Error responses**
- `HTTP status code 503 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)
- `HTTP status code 401 Unauthorized` (not logged in or wrong permissions)


## Database Tables

### `User`

It contains info about users.

```
userId
email
salt
password
verificationCode
firstname
lastname
mobile
role
active
```

#### Preloaded Users

| email                           | password      | role               |
| :------------------------------ | :------------ | :----------------- |
| testHiker@email.com             | Password1234. | Hiker              |
| bruno.rossi@email.com           | Password1234. | Local Guide        |
| testLocalGuide2@email.com       | Password1234. | Local Guide        |
| testLocalGuide3@email.com       | Password1234. | Local Guide        |
| testHutWorker@email.com         | Password1234. | Hut Worker         |
| testEmergencyOperator@email.com | Password1234. | Emergency Operator |

### `Hike`

It contains info about hikes.

```
hikeId
title
writerId
trackPath
city
province
region
length
expectedTime
ascent
maxElevation
difficulty
description
startPoint
endPoint
```

### `Point`

It contains info about points.

```
pointId
type
parkingLot
hut
nameOfLocation
latitude
longitude
```

### `Hut`

It contains info about huts.

```
hutId
hutName
pointId
writerId
city
province
region
numOfBeds
cost
altitude
phone
email
website
```

### `HutDailySchedule`

It contains info about huts' daily schedule.

```
hutId
day
openTime
closeTime
```

### `HikeHut`

It connects the hikes with their huts.

```
hikeId
hutId
```

### `ParkingLot`

It contains info about parking a lots.

```
parkingLotId
parkingLotName
pointId
writerId
capacity
altitude
```

### `HikeParkingLot`

It connects the hikes with their parking lots.

```
hikeId
parkingLotId
```

### `HikeRefPoint`

It connects the hikes with their reference points.

```
hikeId
pointId
```

### `SelectedHike`

It tracks ongoing and completed hikes of a hiker.

```
selectedHikeId
hikeId
hikerId
status
startTime
endTime
```

## Testing

### Testing Frontend

### Testing Backend

The libraries used for testing are `Jest` for unit testing, `Mocha` and `Chai` for integration testing.

To run the unit tests

```
npm test
```

To run the integration tests

```
npm run integration
```

#### Note: to run these commands you must be in `/code/server/`

## Mocks

### Login page

![Login](./doc/mocks/Account/Login.png)

### Registration page

![Registration Hiker](./doc/mocks/Account/Register_default.png)
![Registration Local Guide](./doc/mocks/Account/Register_additional_info.png)

### Select Start/Arrival points

![Select Hike Endpoints](./doc/mocks/Update%20Hikes/SelectEndpoints.jpg)
