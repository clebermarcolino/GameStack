require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { runMigrations } = require('./backend/src/models/migrations');
const routes = require('./backend/src/routes');
const { errorHandler, notFound } = require('./backend/src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({
    name: 'gamestack',
    version: '1.0.0',
    description: 'Sistema de processamento transacional para games',
    endpoints: {
      health: '/api/v1/health',
      players: '/api/v1/players',
      games: '/api/v1/games',
      rankings: '/api/v1/rankings',
      globalRanking: '/api/v1/rankings/global',
    },
    docs: 'Consulte o README.md para documentação completa',
  });
});

app.use(notFound);
app.use(errorHandler);

async function start() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
    console.log(`Endpoints disponíveis:`);
    console.log(`   GET  /api/v1/health`);
    console.log(`   CRUD /api/v1/players`);
    console.log(`   CRUD /api/v1/games`);
    console.log(`   CRUD /api/v1/rankings`);
    console.log(`   GET  /api/v1/rankings/global`);
  });
}

start().catch(err => {
  console.error(' Falha ao iniciar servidor:', err);
  process.exit(1);
});

module.exports = app;
