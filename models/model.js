const pool = require('../db');

async function getTopics() {
    const { rows } = await pool.query('SELECT name FROM topics ORDER BY name');
    return rows.map((r) => r.name);
}

async function topicExists(topic) {
    const { rowCount } = await pool.query('SELECT 1 FROM topics WHERE name = $1', [topic]);
    return rowCount > 0;
}

async function getQuestionsByTopic(topic, { difficulty, limit } = {}, db = pool) {
    const params = [topic];
    let sql = `
    SELECT q.id, q.question, q.answer, q.difficulty
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    WHERE t.name = $1`;

    if (difficulty) {
        params.push(difficulty);
        sql += ` AND q.difficulty = $${params.length}`;
    }
    sql += ' ORDER BY q.id';
    if (limit) {
        params.push(limit);
        sql += ` LIMIT $${params.length}`;
    }
    const { rows } = await db.query(sql, params);
    return rows;
}

async function getRandomQuestion() {
    const { rows } = await pool.query(`
    SELECT q.id, t.name AS topic, q.question, q.difficulty
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    ORDER BY random()
    LIMIT 1`);
    return rows[0] || null;
}

async function getQuestionById(id) {
  const { rows } = await pool.query('SELECT id, answer FROM questions WHERE id = $1', [id]);
  return rows[0] || null;
}

async function addQuestion({ topic, question, answer, difficulty }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO topics (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [topic]);
    const { rows } = await client.query('SELECT id FROM topics WHERE name = $1', [topic]);
    await client.query(
      'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
      [rows[0].id, question, answer, difficulty]
    );
    const updated = await getQuestionsByTopic(topic, {}, client);
    await client.query('COMMIT');
    return updated;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
    getTopics,
    topicExists,
    getQuestionsByTopic,
    getRandomQuestion,
    getQuestionById,
    addQuestion
};