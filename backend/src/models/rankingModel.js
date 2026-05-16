const { query } = require('../config/database');

const RankingModel = {
  async getGlobalRanking({ limit = 10, offset = 0 } = {}) {
    const result = await query(`
      SELECT
        p.id           AS player_id,
        p.name         AS player_name,
        p.username,
        p.avatar_url,
        SUM(r.score)   AS total_score,
        COUNT(r.id)    AS total_partidas,
        MAX(r.score)   AS best_score
      FROM rankings r
      JOIN players p ON p.id = r.player_id
      GROUP BY p.id, p.name, p.username, p.avatar_url
      ORDER BY total_score DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
  },

  async getRankingByGame(gameId, { limit = 10, offset = 0 } = {}) {
    const result = await query(`
      SELECT
        r.id, r.score, r.level, r.played_at,
        p.id AS player_id, p.name AS player_name, p.username, p.avatar_url,
        g.title AS game_title
      FROM rankings r
      JOIN players p ON p.id = r.player_id
      JOIN games   g ON g.id = r.game_id
      WHERE r.game_id = $1
      ORDER BY r.score DESC
      LIMIT $2 OFFSET $3
    `, [gameId, limit, offset]);
    return result.rows;
  },

  async getRankingByPlayer(playerId, { limit = 20, offset = 0 } = {}) {
    const result = await query(`
      SELECT
        r.id, r.score, r.level, r.played_at,
        g.id AS game_id, g.title AS game_title, g.genre, g.cover_url
      FROM rankings r
      JOIN games g ON g.id = r.game_id
      WHERE r.player_id = $1
      ORDER BY r.played_at DESC
      LIMIT $2 OFFSET $3
    `, [playerId, limit, offset]);
    return result.rows;
  },

  async findAll({ limit = 20, offset = 0 } = {}) {
    const result = await query(`
      SELECT r.*, p.name AS player_name, p.username, g.title AS game_title
      FROM rankings r
      JOIN players p ON p.id = r.player_id
      JOIN games   g ON g.id = r.game_id
      ORDER BY r.id ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
  },

  async count() {
    const result = await query(`SELECT COUNT(*) as total FROM rankings`);
    return parseInt(result.rows[0].total);
  },

  async findById(id) {
    const result = await query(`
      SELECT r.*, p.name AS player_name, p.username, g.title AS game_title
      FROM rankings r
      JOIN players p ON p.id = r.player_id
      JOIN games   g ON g.id = r.game_id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0] || null;
  },

  async create({ player_id, game_id, score, level, played_at }) {
    const result = await query(
      `INSERT INTO rankings (player_id, game_id, score, level, played_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [player_id, game_id, score, level || 1, played_at || new Date().toISOString()]
    );
    return this.findById(result.rows[0].id);
  },

  async update(id, { score, level, played_at }) {
    await query(
      `UPDATE rankings SET
        score     = COALESCE($1, score),
        level     = COALESCE($2, level),
        played_at = COALESCE($3, played_at)
       WHERE id = $4`,
      [score ?? null, level ?? null, played_at || null, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await query(`DELETE FROM rankings WHERE id = $1`, [id]);
    return true;
  },
};

module.exports = RankingModel;
