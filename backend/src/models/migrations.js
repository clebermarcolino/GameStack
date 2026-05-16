const { query } = require('../config/database');

async function runMigrations() {
  await query(`
    CREATE TABLE IF NOT EXISTS players (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      username    TEXT UNIQUE NOT NULL,
      avatar_url  TEXT,
      bio         TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS games (
      id            SERIAL PRIMARY KEY,
      title         TEXT NOT NULL,
      genre         TEXT NOT NULL,
      description   TEXT,
      cover_url     TEXT,
      developer     TEXT,
      release_year  INTEGER,
      platform      TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS rankings (
      id          SERIAL PRIMARY KEY,
      player_id   INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      game_id     INTEGER NOT NULL REFERENCES games(id)   ON DELETE CASCADE,
      score       INTEGER NOT NULL DEFAULT 0,
      level       INTEGER DEFAULT 1,
      played_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log(' Migrations executadas com sucesso!');
}

module.exports = { runMigrations };