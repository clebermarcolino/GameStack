const RankingModel = require('../models/rankingModel');
const PlayerModel = require('../models/playerModel');
const GameModel = require('../models/gameModel');

const RankingController = {
  async index(req, res) {
    try {
      const { limit = 20, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const [rankings, total] = await Promise.all([
        RankingModel.findAll({ limit: Number(limit), offset: Number(offset) }),
        RankingModel.count(),
      ]);

      res.json({
        data: rankings,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar rankings', detail: err.message });
    }
  },

  async show(req, res) {
    try {
      const ranking = await RankingModel.findById(req.params.id);
      if (!ranking) return res.status(404).json({ error: 'Pontuação não encontrada' });
      res.json({ data: ranking });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar pontuação', detail: err.message });
    }
  },

  async globalRanking(req, res) {
    try {
      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      const data = await RankingModel.getGlobalRanking({ limit: Number(limit), offset: Number(offset) });
      res.json({ data });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar ranking global', detail: err.message });
    }
  },

  async byGame(req, res) {
    try {
      const game = await GameModel.findById(req.params.gameId);
      if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });

      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      const data = await RankingModel.getRankingByGame(req.params.gameId, { limit: Number(limit), offset: Number(offset) });
      res.json({ data, game });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar ranking do jogo', detail: err.message });
    }
  },

  async byPlayer(req, res) {
    try {
      const player = await PlayerModel.findById(req.params.playerId);
      if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });

      const { limit = 20, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      const data = await RankingModel.getRankingByPlayer(req.params.playerId, { limit: Number(limit), offset: Number(offset) });
      res.json({ data, player });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar pontuações do jogador', detail: err.message });
    }
  },

  async create(req, res) {
    try {
      const { player_id, game_id, score, level, played_at } = req.body;

      if (!player_id || !game_id || score === undefined) {
        return res.status(400).json({ error: 'Campos obrigatórios: player_id, game_id, score' });
      }

      const [player, game] = await Promise.all([
        PlayerModel.findById(player_id),
        GameModel.findById(game_id),
      ]);

      if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });
      if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });

      const ranking = await RankingModel.create({ player_id, game_id, score, level, played_at });
      res.status(201).json({ data: ranking, message: 'Pontuação registrada com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao registrar pontuação', detail: err.message });
    }
  },

  async update(req, res) {
    try {
      const ranking = await RankingModel.findById(req.params.id);
      if (!ranking) return res.status(404).json({ error: 'Pontuação não encontrada' });

      const { score, level, played_at } = req.body;
      const updated = await RankingModel.update(req.params.id, { score, level, played_at });
      res.json({ data: updated, message: 'Pontuação atualizada com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar pontuação', detail: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const ranking = await RankingModel.findById(req.params.id);
      if (!ranking) return res.status(404).json({ error: 'Pontuação não encontrada' });

      await RankingModel.delete(req.params.id);
      res.json({ message: 'Pontuação removida com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover pontuação', detail: err.message });
    }
  },
};

module.exports = RankingController;