const express = require('express');

const { InfoController,UserController } = require('../../controllers');
const {AuthRequestMiddlewares} = require('../../middlewares');
const router = express.Router();

router.get('/info', InfoController.info);

router.post('/register',AuthRequestMiddlewares.validateCreateUser,UserController.signup);
router.post('/login',AuthRequestMiddlewares.validateAuthRequest,UserController.signin);
router.put('/preferences',AuthRequestMiddlewares.checkAuth,UserController.createUserPreference)
module.exports = router;