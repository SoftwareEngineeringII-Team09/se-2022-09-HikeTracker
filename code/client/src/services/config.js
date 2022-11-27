const SERVER_PORT = process.env.NODE_ENV === "production" ? 80 : 3001
const SERVER_URL = `http://localhost:${SERVER_PORT}/api`;

module.exports = {
    SERVER_URL
}