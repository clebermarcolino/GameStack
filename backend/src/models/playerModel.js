const { query } = require('../config/database');

const PlayerModel = {
  async findAll({ search, limit = 20, offset = 0 } = {}) {
    let text, params;

    if (search) {
      text = `SELECT * FROM players
              WHERE name ILIKE $1 OR username ILIKE $1 OR email ILIKE $1
              ORDER BY id DESC LIMIT $2 OFFSET $3`;
      params = [`%${search}%`, limit, offset];
    } else {
      text = `SELECT * FROM players ORDER BY id DESC LIMIT $1 OFFSET $2`;
      params = [limit, offset];
    }

    const result = await query(text, params);
    return result.rows;
  },

  async count({ search } = {}) {
    let text = `SELECT COUNT(*) as total FROM players`;
    const params = [];
    if (search) {
      text += ` WHERE name ILIKE $1 OR username ILIKE $1 OR email ILIKE $1`;
      params.push(`%${search}%`);
    }
    const result = await query(text, params);
    return parseInt(result.rows[0].total);
  },

  async findById(id) {
    const result = await query(`SELECT * FROM players WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async findByEmail(email) {
    const result = await query(`SELECT * FROM players WHERE email = $1`, [email]);
    return result.rows[0] || null;
  },

  async findByUsername(username) {
    const result = await query(`SELECT * FROM players WHERE username = $1`, [username]);
    return result.rows[0] || null;
  },

  async create({ name, email, username, avatar_url, bio }) {
    const result = await query(
      `INSERT INTO players (name, email, username, avatar_url, bio)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, username, avatar_url || null, bio || null]
    );
    return result.rows[0];
  },

  async update(id, { name, email, username, avatar_url, bio }) {
    const result = await query(
      `UPDATE players SET
        name       = COALESCE($1, name),
        email      = COALESCE($2, email),
        username   = COALESCE($3, username),
        avatar_url = $4,
        bio        = COALESCE($5, bio),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *`,
    [name || null, email || null, username || null, avatar_url || null, bio || null, id]
  )
    return result.rows[0]
  },

  async delete(id) {
    await query(`DELETE FROM players WHERE id = $1`, [id]);
    return true;
  },
};

module.exports = PlayerModel;