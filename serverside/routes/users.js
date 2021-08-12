/* eslint-disable quotes */
"use strict";

const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.save);
router.post('/login', userController.login);

router.get('/', userController.getAllUser);
router.get('/:username', userController.getByUserName);
router.put('/:username', userController.update);
router.delete('/:id', userController.delete);


module.exports = router;