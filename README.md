![tests workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/tests.yml/badge.svg)
![sonarcloud analysis workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/sonarcloud.yml/badge.svg)
![docker build workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/docker-build.yml/badge.svg)
![docker release workflow](https://github.com/SoftwareEngineeringII-Team09/se-2022-09-HikeTracker/actions/workflows/docker-release.yml/badge.svg)

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
    - [Development](#development)
    - [Tests](#tests)
    - [Production](#production)
	 - [Deploy on Docker Hub](#Deploy-on-Docker-Hub)
    - [Pull from Docker Hub](#Pull-from-Docker-Hub)
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
    - [Route `/account/reference-points/update`](#accountreference-pointsupdate)
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
    - [Hut Routes](#hut-routes)
	    - [`POST /api/huts`](#post-apihuts)
	    - [`GET /api/huts`](#get-apihuts)
    - [Parking Lot Routes](#parking-lot-routes)
	    - [`POST /api/parkingLots`](#post-apiparkinglots)
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
7. [Testing](#testing)
	  - [Testing Frontend](#testing-frontend)
	  - [Testing Backend](#testing-backend)
8. [Mocks](#mocks)

## Docker Documentation

You must be in `/code` to be able to run docker commands.

### Development

This command allows to run both client and server in development mode.

```
docker-compose up
```

### Tests

You can run tests in interactive mode with commands:

```
docker-compose run --rm client-tests
docker-compose run --rm server-tests
```

For running both tests and the app (suitable for a fast check, not for the real development):

```
docker-compose --profile test up
```

### Production

```
docker-compose -f docker-compose.prod.yml stop && docker-compose -f docker-compose.prod.yml up --build -d
```

the ```-f``` flag is for custom docker file path

### Deploy on Docker Hub

Be sure that the .env file is in `/server` directory

```
docker login
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push
```

### Pull from Docker Hub

This repo has two images, one for the user interface and one for the server logic. Both images can be pulled with:

```
docker pull andreadeluca/se_2022_09_hike_tracker:client
docker pull andreadeluca/se_2022_09_hike_tracker:server
```

When images are built, you can run them with:

```
docker run -d -p 3001:3001 --name se09-server andreadeluca/se_2022_09_hike_tracker:server
docker run -d -p 3000:80 --name se09-client --link se09-server:server andreadeluca/se_2022_09_hike_tracker:client
```
The app can be reached on http://localhost:3000

Note:

- the images se09-client depends on the se09-server one, so this must be run first
- in case of name conflicts, remove the containers with ```docker rm <name>``` and run again the commands above

## Technical Dept Strategy

We made repo analysis with Sonarcloud, that allows us to track security issues, code smells and some other useful info you may see above.

## Technologies

### Frontend

The language used is `Javascript` and the framework choosen is `ReactJS`.

Here the list of dependencies installed:

```json
"dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "formik": "^2.2.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^9.1.1",
    "web-vitals": "^2.1.4",
    "yup": "^0.32.11"
},
"devDependencies": {
    "@craco/craco": "^7.0.0",
    "@cypress/code-coverage": "^3.10.0",
    "@testing-library/dom": "^8.19.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/react-toastify": "^4.1.0",
    "autoprefixer": "^10.4.12",
    "axios": "^1.1.3",
    "bootstrap": "^5.2.2",
    "classnames": "^2.3.2",
    "cypress": "^11.1.0",
    "cypress-dark": "^1.8.3",
    "cypress-file-upload": "^5.0.8",
    "geolib": "^3.3.3",
    "history": "^5.3.0",
    "leaflet": "^1.9.2",
    "leaflet-topography": "^0.2.1",
    "postcss-preset-env": "^7.8.2",
    "react-app-alias": "^2.2.2",
    "react-bootstrap": "^2.5.0",
    "react-icons": "^4.6.0",
    "react-leaflet": "^4.1.0",
    "react-router-dom": "^6.4.3",
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
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.8.0",
    "nodemailer-smtp-transport": "^2.7.4",
    "nodemon": "^2.0.20",
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

### `/account/reference-points/update`

The page allows a local guide to update the reference points for an hike.

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
  "description": "This is description",
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
  "description": "This is description",
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

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)


#### `GET /api/hikes/:hikeId/download` 

Get gpx file according to the hike Id.

**Request header:**

`Content-Type: application/json`

`Params: req.params.hikeId to retrieve the id of the hike.`

**Response body**

`HTTP status code 200 OK`
`file requested from frontend`

**Error responses**

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
   }
  
]
  
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
  "WriterId":7,
  "city": 4017,
  "province":2,
  "region":1,
  "numberOfBeds":50,
  "cost":20,
  "latitude":123,
  "longitude":231,
  "altitude":343.234234,
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


### **Parking Lot Routes**

#### `POST /api/parkingLots`

Post a new parking lot.

**Request body:**

`Content-Type: application/json`

`Body: a JSON object containing hut information.`

```json
{
  "parkingLotName": "hutName3",
  "latitude":123,
  "longitude":231,
  "altitude":343.234234,
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
| testLocalGuide@email.com        | Password1234. | Local Guide        |
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
expected_time
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
altitude
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