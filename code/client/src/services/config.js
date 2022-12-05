const SERVER_PORT = process.env.NODE_ENV === "production" ? 80 : 3001
const CLIENT_PORT = 3000
const SERVER_URL = `http://localhost:${SERVER_PORT}/api`;
const CLIENT_URL = `http://localhost:${CLIENT_PORT}/`;

module.exports = {
    SERVER_URL,
    CLIENT_URL
}