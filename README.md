This project has been developed by Team-09 for the course of "Software Engineering II", attended during the academic year 2022/23 at Politecnico di Torino, Master's Degree in Computer Engineering.

## Table of Contents

1. [Technologies](#technologies)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Database](#backend)
2. [React Client Application Routes](#react-client-application-routes)
   - [Route `/`](#)
   - [Route `/*`](#1)
3. [API Server](#api-server)
   - [Ticket Routes](#ticket-routes)
     - [`GET /api/tickets/:counterId`](#get-apiticketscounterid)
4. [Database Tables](#database-tables)
   - [Table `Service`](#service)
5. [React Components APIs](#react-components-apis)
6. [Mocks](#mocks)

## Technologies

### Frontend

The language used is `Javascript` and the framework choosen is `ReactJS`.

Here the list of dependencies installed:

```json
"dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
},
"devDependencies": {
    "autoprefixer": "^10.4.12",
    "axios": "^1.1.3",
    "bootstrap": "^5.2.2",
    "postcss-preset-env": "^7.8.2",
    "react-bootstrap": "^2.5.0",
    "react-icons": "^4.6.0",
    "react-router-dom": "^6.4.3",
    "react-toastify": "^9.1.1",
    "sass": "^1.55.0"
}
```

### Backend

The language used is `Javascript` and the framework choosen is `ExpressJS`.

Here the list of dependencies installed:

```json
 "dependencies": {

},
  "devDependencies": {

}
```

### Database

We've choosen a relational database and the DBMS choosen is `SQLite3`.

For more info about the database structure, see [Database Tables](#database-tables).

## React Client Application Routes

### `/`

_This is the index route_

Homepage for visitor users (not logged in users).

_This route is unprotected from the user authentication. Moreover, it is unreachable when the user is logged in._

### `/*`

Any other route is matched by this one where the application shows an error.

## API Server

### **Ticket Routes**

#### `GET /api/tickets/:counterId`

Get served ticket associated to counterId.

**Request header:**

`Content-Type: application/json`

`Params: req.params.counterId to retrieve the id of the counter.`

**Response body**

`HTTP status code 200 OK`

```json
{
	"ticket": {
		"TicketId": 5,
		"CreateTime": "2022-10-19 17:42:50",
		"ServiceId": 1,
		"Status": "issued",
		"CounterId": 1
	}
}
```

**Error responses**

- `HTTP status code 500 Internal Server Error` (generic server error)
- `HTTP status code 404 Not Found` (resource not found error)
- `HTTP status code 422 Unprocessable Entity` (validation error)

## Database Tables

### `Service`

It contains info about services offered.

```
ServiceId (PRIMARY KEY)
ServiceName
ServiceTime
```

#### Preloaded Data

| ServiceId | ServiceName | ServiceTime |
| :-------- | :---------- | :---------- |
| 1         | s1Name      | 10          |
| 2         | s2Name      | 20          |

## React Components APIs

## Mocks
