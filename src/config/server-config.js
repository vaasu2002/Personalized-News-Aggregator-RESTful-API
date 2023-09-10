const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY:process.env.JWT_EXPIRY,
    API_KEY:process.env.API_KEY,
    API_URL:process.env.API_URL,
}