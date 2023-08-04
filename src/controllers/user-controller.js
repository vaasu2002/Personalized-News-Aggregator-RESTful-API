const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const bcrypt = require('bcryptjs');
const users = require('../users.json')
const {FsAccess,Auth} = require('../utils/common')

const signup = async (req,res)=>{
    try{
        const fullname = req.body.fullname;
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const isEmailTaken = users.some((user) => user.email === email);
        const isUsernameTaken = users.some((user) => user.username === username);
        if (isEmailTaken || isUsernameTaken) {
            ErrorResponse.error = 'Email or username is already taken';
            return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
        }

        const newUser = {
            id: users.length + 1,
            fullname,
            username,
            password: hashedPassword,
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
            console.log('Username does not exists');
            return res  
                .status(StatusCodes.BAD_REQUEST)
                .json('Username does not exists');
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
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    signup,
    signin
}