const express = require('express');
const router = express.Router();

const PlayerController = require('../controllers/playerController');
const GameController = require('../controllers/gameController');
const RankingController = require('../controllers/rankingController');

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

router.get('/players',          PlayerController.index);
router.get('/players/:id',      PlayerController.show);
router.post('/players',         PlayerController.create);
router.put('/players/:id',      PlayerController.update);
router.patch('/players/:id',    PlayerController.update);
router.delete('/players/:id',   PlayerController.destroy);

router.get('/games',            GameController.index);
router.get('/games/genres',     GameController.genres);
router.get('/games/platforms',  GameController.platforms);
router.get('/games/:id',        GameController.show);
router.post('/games',           GameController.create);
router.put('/games/:id',        GameController.update);
router.patch('/games/:id',      GameController.update);
router.delete('/games/:id',     GameController.destroy);

router.get('/rankings',                         RankingController.index);
router.get('/rankings/global',                  RankingController.globalRanking);
router.get('/rankings/game/:gameId',            RankingController.byGame);
router.get('/rankings/player/:playerId',        RankingController.byPlayer);
router.get('/rankings/:id',                     RankingController.show);
router.post('/rankings',                        RankingController.create);
router.put('/rankings/:id',                     RankingController.update);
router.patch('/rankings/:id',                   RankingController.update);
router.delete('/rankings/:id',                  RankingController.destroy);

module.exports = router;
