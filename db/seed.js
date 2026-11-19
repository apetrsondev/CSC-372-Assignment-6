const fs = require('fs');
const path = require('path');
const pool = require('./index');

const topics = ['science', 'geography'];

const questionsByTopic = {
  science: [
    { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
    { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
    { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' }
  ],
  geography: [
    { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
    { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' }
  ]
};

async function seed() {
  const client = await pool.connect();
  try {
    await client.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

    for (const name of topics) {
      const { rows } = await client.query(
        'INSERT INTO topics (name) VALUES ($1) RETURNING id', [name]
      );
      for (const q of questionsByTopic[name]) {
        await client.query(
          'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
          [rows[0].id, q.question, q.answer, q.difficulty]
        );
      }
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
