const model = require('../models/model');

const difficulties = ['easy', 'medium', 'hard'];

async function getTopics(req, res, next) {
  try {
    res.json(await model.getTopics());
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTopics
};