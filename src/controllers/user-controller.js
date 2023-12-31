const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const bcrypt = require('bcryptjs');
const users = require('../users.json')
const {FsAccess,Auth} = require('../utils/common')
const defaultPreferences = {
    country:'in'
}
const signup = async (req,res)=>{
    try{
        const fullname = req.body.fullname;
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const preferences = req.body.preferences || defaultPreferences;
        
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const isEmailTaken = users.some((user) => user.email === email);
        const isUsernameTaken = users.some((user) => user.username === username);
        if (isEmailTaken || isUsernameTaken) {
            throw new AppError('Username or email already exists', StatusCodes.BAD_REQUEST);
        }

        const newUser = {
            id: users.length + 1,
            fullname,
            username,
            password: hashedPassword,
            preferences:preferences,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        users.push(newUser);
        FsAccess.saveTasks(users);
        SuccessResponse.data = newUser;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
  
        }catch(error){
            ErrorResponse.error = error;
            return res  
                    .status(error.statusCode)
                    .json(ErrorResponse);
            }
}



const signin = async (req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;


        const user = users.find(user => user.username === username);
        if(!user){
            throw new AppError('Username does not exists', StatusCodes.BAD_REQUEST);
        }
        const passwordMatch = Auth.checkPassword(password, user.password);
        if(!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }
        const jwt = Auth.createToken({id: user.id, email: user.email});
        SuccessResponse.data = jwt;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);

    }catch(error){
        ErrorResponse.error = error;
            return res  
                    .status(error.statusCode)
                    .json(ErrorResponse);
    }
}

const createUserPreference = async(req,res)=>{
    try{
        const id = req.user;
        const preferences = req.body;

        const userIndex = users.findIndex((user) => user.id === id);
        users[userIndex] = { ...users[userIndex], ...preferences};
        FsAccess.saveTasks(users);
        SuccessResponse.data = users[userIndex];
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error = error;
            return res  
                    .status(error.statusCode)
                    .json(ErrorResponse);
    }
}

const getUserPreference = async(req,res)=>{
    try{
        const id = req.user;
        const userIndex = users.findIndex((user) => user.id === id);
        SuccessResponse.data = users[userIndex];
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error = error;
            return res  
                    .status(error.statusCode)
                    .json(ErrorResponse);
    }
}

module.exports = {
    signup,
    signin,
    createUserPreference,
    getUserPreference
}