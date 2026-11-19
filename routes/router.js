const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

router.get('/topics', controller.getTopics);
router.get('/topic/:topic', controller.getQuestionsByTopic);
router.get('/random', controller.getRandomQuestion);

module.exports = router;
