const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const { Auth} = require('../utils/common');



async function isAuthenticated(token) {
    try {
        const response = Auth.verifyToken(token);
        return response.id; 
    } catch(error) {
        if(error.name === 'JsonWebTokenError') { 
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    isAuthenticated
}