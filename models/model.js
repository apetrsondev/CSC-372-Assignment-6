const pool = require('../db');

async function getTopics() {
  const { rows } = await pool.query('SELECT name FROM topics ORDER BY name');
  return rows.map((r) => r.name);
}



module.exports = {
  getTopics
};