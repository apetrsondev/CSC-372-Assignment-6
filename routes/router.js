const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

router.get('/topics', controller.getTopics);


module.exports = router;
