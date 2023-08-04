const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const bcrypt = require('bcryptjs');
const users = require('../users.json')
const {FsAccess,Auth} = require('../utils/common')
const jwt = require('jsonwebtoken')

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
    const username = req.body.username;
    const password = req.body.password;


    const user = users.find(user => user.username === username);
    if(!user){
        console.log('Username does not exists');
        return res  
            .status(StatusCodes.BAD_REQUEST)
            .json('Username does not exists');
    }
    console.log(Auth.checkPassword(password,user.password));
}

module.exports = {
    signup,
    signin
}