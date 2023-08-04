const express = require('express');

const { InfoController,UserController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);
router.post('/testing/signin',UserController.signin);
router.post('/testing/signup',UserController.signup);
module.exports = router;