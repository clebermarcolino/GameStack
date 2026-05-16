require('dotenv').config();
const { runMigrations } = require('./backend/src/models/migrations');
const PlayerModel = require('./backend/src/models/playerModel');
const GameModel = require('./backend/src/models/gameModel');
const RankingModel = require('./backend/src/models/rankingModel');

const players = [
  { name: 'Lucas Silva',   email: 'lucas@email.com',  username: 'lsilva',   bio: 'Gamer desde 2005' },
  { name: 'Ana Martins',   email: 'ana@email.com',    username: 'anamarts', bio: 'Speedrunner' },
  { name: 'Pedro Costa',   email: 'pedro@email.com',  username: 'pedrocst', bio: 'RPG lover' },
  { name: 'Julia Ramos',   email: 'julia@email.com',  username: 'jramos',   bio: 'Competitive FPS' },
  { name: 'Rafael Torres', email: 'rafael@email.com', username: 'rtorres',  bio: 'Casual gamer' },
];

const games = [
  { title: 'Hollow Knight',  genre: 'Metroidvania', developer: 'Team Cherry',      release_year: 2017, platform: 'PC' },
  { title: 'Celeste',        genre: 'Plataforma',   developer: 'Maddy Thorson',    release_year: 2018, platform: 'PC' },
  { title: 'Hades',          genre: 'Roguelite',    developer: 'Supergiant Games', release_year: 2020, platform: 'PC' },
  { title: 'Dead Cells',     genre: 'Roguelite',    developer: 'Motion Twin',      release_year: 2018, platform: 'PC' },
  { title: 'Stardew Valley', genre: 'Simulação',    developer: 'ConcernedApe',     release_year: 2016, platform: 'PC' },
  { title: 'Among Us',       genre: 'Party',        developer: 'Innersloth',       release_year: 2018, platform: 'Mobile' },
];

async function seed() {
  console.log(' Iniciando seed...');
  await runMigrations();

  console.log(' Criando jogadores...');
  const createdPlayers = [];
  for (const p of players) {
    const exists = await PlayerModel.findByEmail(p.email);
    if (!exists) {
      const player = await PlayerModel.create(p);
      createdPlayers.push(player);
      console.log(`  ✓ [id: ${player.id}] ${player.name} (@${player.username})`);
    } else {
      createdPlayers.push(exists);
      console.log(`  - [id: ${exists.id}] ${exists.name} já existe`);
    }
  }

  console.log(' Criando jogos...');
  const createdGames = [];
  for (const g of games) {
    const existing = await GameModel.findAll({ search: g.title });
    if (!existing.length) {
      const game = await GameModel.create(g);
      createdGames.push(game);
      console.log(`  ✓ [id: ${game.id}] ${game.title} (${game.genre})`);
    } else {
      createdGames.push(existing[0]);
      console.log(`  - [id: ${existing[0].id}] ${existing[0].title} já existe`);
    }
  }

  console.log(' Registrando pontuações...');
  const scores = [
    { player: 0, game: 0, score: 15420, level: 8 },
    { player: 1, game: 0, score: 22100, level: 12 },
    { player: 2, game: 1, score: 8900,  level: 5 },
    { player: 0, game: 2, score: 31500, level: 15 },
    { player: 3, game: 3, score: 19800, level: 10 },
    { player: 4, game: 4, score: 5200,  level: 3 },
    { player: 1, game: 2, score: 28000, level: 14 },
    { player: 2, game: 3, score: 12300, level: 7 },
    { player: 3, game: 0, score: 9700,  level: 6 },
    { player: 0, game: 5, score: 4100,  level: 2 },
  ];

  for (const s of scores) {
    if (createdPlayers[s.player] && createdGames[s.game]) {
      const ranking = await RankingModel.create({
        player_id: createdPlayers[s.player].id,
        game_id: createdGames[s.game].id,
        score: s.score,
        level: s.level,
      });
      console.log(`  ✓ [id: ${ranking.id}] ${createdPlayers[s.player].username} → ${createdGames[s.game].title}: ${s.score} pts`);
    }
  }

  console.log('\n Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch(err => {
  console.error(' Erro no seed:', err);
  process.exit(1);
});