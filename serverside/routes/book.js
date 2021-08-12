/* eslint-disable quotes */
"use strict";

const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');


router.get('/', bookController.getAllBook);
router.get('/:id', bookController.getById);
router.post('/', bookController.save);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);


module.exports = router;