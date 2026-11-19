const model = require('../models/model');

const difficulties = ['easy', 'medium', 'hard'];

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
            if (!DIFFICULTIES.includes(d)) {
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


module.exports = {
    getTopics,
    getQuestionsByTopic,
    getRandomQuestion
};