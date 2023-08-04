const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const users = require('../users.json')
const axios = require('axios');
const {ServerConfig} = require('../config')


const getNews = async(req,res)=>{
    try{
        const id = req.user;
        const userIndex = users.findIndex((user) => user.id === id);
        let preferences = users[userIndex].preferences;

        
        const link = `${ServerConfig.API_URL}country=${preferences.country}&apiKey=${ServerConfig.API_KEY}`;
        const response = await axios.get(link);
        SuccessResponse.data = response.data.articles
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
    getNews
}