const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.PORT,
    JWT_SECRET: process.env.PORT,
    JWT_EXPIRY:process.env.JWT_SECRET
}