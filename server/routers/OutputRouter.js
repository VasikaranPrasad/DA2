const express = require('express');
const router = express.Router();
const controller = require('../controller/OutputController')

router.get('/api/data', controller.getOutputData);

module.exports = router;
