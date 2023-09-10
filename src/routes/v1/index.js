const express = require('express');

const { InfoController,UserController,NewsController } = require('../../controllers');
const {AuthRequestMiddlewares} = require('../../middlewares');
const router = express.Router();

router.get('/info', InfoController.info);

router.post('/register',AuthRequestMiddlewares.validateCreateUser,UserController.signup);
router.post('/login',AuthRequestMiddlewares.validateAuthRequest,UserController.signin);
router.put('/preferences',AuthRequestMiddlewares.checkAuth,UserController.createUserPreference);
router.get('/preferences',AuthRequestMiddlewares.checkAuth,UserController.getUserPreference);
router.get('/news',AuthRequestMiddlewares.checkAuth,NewsController.getNews);
module.exports = router;