const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserService } = require('../services');

function validateCreateUser(req, res, next) {
    
    error_explaination = [];
    if(!req.body.fullname){
        error_explaination.push('Fullname not found in the oncoming request in the correct form');
    }
    if(!req.body.username){
        error_explaination.push('Username not found in the oncoming request in the correct form');
    }
    if(!req.body.password){
        error_explaination.push('Password not found in the oncoming request in the correct form');
    }
    if(!req.body.email){
        error_explaination.push('Email Id not found in the oncoming request in the correct form');
    }
    if(!req.body.confirm_password){
        error_explaination.push('Confirm password Id not found in the oncoming request in the correct form');
    }
    if(req.body.confirm_password!==req.body.password){
        error_explaination.push('Confirm password is not same as password');
    }
    if(error_explaination.length > 0){
        ErrorResponse.message = 'Something went wrong while creating the user';
        ErrorResponse.error = new AppError(error_explaination, StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
    next();
}

function validateAuthRequest(req, res, next) {
    error_explaination = [];
    if(!req.body.username) {
        error_explaination.push('Username not found in the incoming request in the correct form');
    }
    if(!req.body.password) {
        error_explaination.push('password not found in the incoming request in the correct form');
    }
    if(error_explaination.length > 0){
        ErrorResponse.message = 'Something went wrong while creating the user';
        ErrorResponse.error = new AppError(error_explaination, StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse);
    }
    next();
}

async function checkAuth(req, res, next) {
    try {
        const token = req.headers['x-access-token'];
        if(!token){
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST); 
        }
        const response = await UserService.isAuthenticated(token);
        if(response) {
            req.user = response; // setting the user id in the req object
            next();
        }
    } catch(error) {
        ErrorResponse.error = error.explanation
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
    
}



module.exports = {
    validateCreateUser,
    validateAuthRequest,
    checkAuth,
}