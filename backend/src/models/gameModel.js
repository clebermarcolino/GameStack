const { query } = require('../config/database');

const GameModel = {
  async findAll({ search, genre, platform, limit = 20, offset = 0 } = {}) {
    const conditions = [];
    const params = [];
    let i = 1;

    if (search) {
      conditions.push(`(title ILIKE $${i} OR developer ILIKE $${i} OR description ILIKE $${i})`);
      params.push(`%${search}%`); i++;
    }
    if (genre)    { conditions.push(`genre = $${i}`);    params.push(genre);    i++; }
    if (platform) { conditions.push(`platform = $${i}`); params.push(platform); i++; }

    let text = `SELECT * FROM games`;
    if (conditions.length) text += ` WHERE ` + conditions.join(' AND ');
    text += ` ORDER BY id ASC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(limit, offset);

    const result = await query(text, params);
    return result.rows;
  },

  async count({ search, genre, platform } = {}) {
    const conditions = [];
    const params = [];
    let i = 1;

    if (search) {
      conditions.push(`(title ILIKE $${i} OR developer ILIKE $${i})`);
      params.push(`%${search}%`); i++;
    }
    if (genre)    { conditions.push(`genre = $${i}`);    params.push(genre);    i++; }
    if (platform) { conditions.push(`platform = $${i}`); params.push(platform); i++; }

    let text = `SELECT COUNT(*) as total FROM games`;
    if (conditions.length) text += ` WHERE ` + conditions.join(' AND ');

    const result = await query(text, params);
    return parseInt(result.rows[0].total);
  },

  async findById(id) {
    const result = await query(`SELECT * FROM games WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  async getGenres() {
    const result = await query(`SELECT DISTINCT genre FROM games ORDER BY genre`);
    return result.rows.map(r => r.genre);
  },

  async getPlatforms() {
    const result = await query(`SELECT DISTINCT platform FROM games WHERE platform IS NOT NULL ORDER BY platform`);
    return result.rows.map(r => r.platform);
  },

  async create({ title, genre, description, cover_url, developer, release_year, platform }) {
    const result = await query(
      `INSERT INTO games (title, genre, description, cover_url, developer, release_year, platform)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, genre, description || null, cover_url || null, developer || null, release_year || null, platform || null]
    );
    return result.rows[0];
  },

  async update(id, { title, genre, description, cover_url, developer, release_year, platform }) {
    const result = await query(
      `UPDATE games SET
        title        = COALESCE($1, title),
        genre        = COALESCE($2, genre),
        description  = COALESCE($3, description),
        cover_url    = COALESCE($4, cover_url),
        developer    = COALESCE($5, developer),
        release_year = COALESCE($6, release_year),
        platform     = COALESCE($7, platform),
        updated_at   = NOW()
       WHERE id = $8
       RETURNING *`,
      [title || null, genre || null, description || null, cover_url || null, developer || null, release_year || null, platform || null, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await query(`DELETE FROM games WHERE id = $1`, [id]);
    return true;
  },
};

module.exports = GameModel;