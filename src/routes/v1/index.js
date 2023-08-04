const express = require('express');

const { InfoController,UserController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);

router.post('/register',UserController.signup);
router.post('/login',UserController.signin);
module.exports = router;