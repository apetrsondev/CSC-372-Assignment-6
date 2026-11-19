const model = require('../models/model');

const difficulties = ['easy', 'medium', 'hard'];

function isBlank(v) {
  return typeof v !== 'string' || v.trim() === '';
}

async function getTopics(req, res, next) {
    try {
        res.json(await model.getTopics());
    } catch (err) {
        next(err);
    }
}

async function getQuestionsByTopic(req, res, next) {
    try {
        const topic = req.params.topic.trim().toLowerCase();
        const { limit, difficulty } = req.query;

        if (!(await model.topicExists(topic))) {
            return res.status(404).json({ error: `topic '${req.params.topic}' not found.` });
        }
        const options = {};
        if (difficulty !== undefined) {
            const d = String(difficulty).toLowerCase();
            if (!difficulties.includes(d)) {
                return res.status(400).json({ error: "difficulty must be 'easy', 'medium', or 'hard'." });
            }
            options.difficulty = d;
        }
        if (limit !== undefined) {
            const n = Number(limit);
            if (!Number.isInteger(n) || n < 1) {
                return res.status(400).json({ error: 'limit must be a positive integer.' });
            }
            options.limit = n;
        }
        res.json(await model.getQuestionsByTopic(topic, options));
    } catch (err) {
        next(err);
    }

}

async function getRandomQuestion(req, res, next) {
    try {
        const q = await model.getRandomQuestion();
        if (!q) return res.status(404).json({ error: 'No questions available.' });
        res.json(q);
    } catch (err) {
        next(err);
    }
}

async function checkAnswer(req, res, next) {
  try {
    const { id, guess } = req.body || {};

    if (id === undefined || id === null || id === '' || typeof guess !== 'string') {
      return res.status(400).json({ error: 'Both id and guess are required.' });
    }
    const qid = Number(id);
    if (!Number.isInteger(qid) || qid < 1) {
      return res.status(400).json({ error: 'id must be a positive integer.' });
    }

    const question = await model.getQuestionById(qid);
    if (!question) {
      return res.status(404).json({ error: `Question with id ${qid} not found.` });
    }

    const correct = guess.trim().toLowerCase() === question.answer.trim().toLowerCase();
    res.json({ correct, answer: question.answer });
  } catch (err) {
    next(err);
  }
}
async function addQuestion(req, res, next) {
  try {
    const { topic, question, answer, difficulty } = req.body || {};

    if ([topic, question, answer, difficulty].some(isBlank)) {
      return res.status(400).json({
        error: 'topic, question, answer, and difficulty are all required.'
      });
    }
    const d = difficulty.trim().toLowerCase();
    if (!difficulties.includes(d)) {
      return res.status(400).json({ error: "difficulty must be 'easy', 'medium', or 'hard'." });
    }

    const updated = await model.addQuestion({
      topic: topic.trim().toLowerCase(),
      question: question.trim(),
      answer: answer.trim(),
      difficulty: d
    });
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
    getTopics,
    getQuestionsByTopic,
    getRandomQuestion,
    checkAnswer,
    addQuestion
};