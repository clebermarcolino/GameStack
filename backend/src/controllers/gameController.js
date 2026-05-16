const GameModel = require('../models/gameModel');

const GameController = {
  async index(req, res) {
    try {
      const { search, genre, platform, limit = 20, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const [games, total] = await Promise.all([
        GameModel.findAll({ search, genre, platform, limit: Number(limit), offset: Number(offset) }),
        GameModel.count({ search, genre, platform }),
      ]);

      res.json({
        data: games,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar jogos', detail: err.message });
    }
  },

  async show(req, res) {
    try {
      const game = await GameModel.findById(req.params.id);
      if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });
      res.json({ data: game });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar jogo', detail: err.message });
    }
  },

  async create(req, res) {
    try {
      const { title, genre, description, cover_url, developer, release_year, platform } = req.body;

      if (!title || !genre) {
        return res.status(400).json({ error: 'Campos obrigatórios: title, genre' });
      }

      const game = await GameModel.create({ title, genre, description, cover_url, developer, release_year, platform });
      res.status(201).json({ data: game, message: 'Jogo criado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar jogo', detail: err.message });
    }
  },

  async update(req, res) {
    try {
      const game = await GameModel.findById(req.params.id);
      if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });

      const { title, genre, description, cover_url, developer, release_year, platform } = req.body;
      const updated = await GameModel.update(req.params.id, { title, genre, description, cover_url, developer, release_year, platform });
      res.json({ data: updated, message: 'Jogo atualizado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar jogo', detail: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const game = await GameModel.findById(req.params.id);
      if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });

      await GameModel.delete(req.params.id);
      res.json({ message: 'Jogo removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover jogo', detail: err.message });
    }
  },

  async genres(req, res) {
    try {
      const genres = await GameModel.getGenres();
      res.json({ data: genres });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar gêneros', detail: err.message });
    }
  },

  async platforms(req, res) {
    try {
      const platforms = await GameModel.getPlatforms();
      res.json({ data: platforms });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar plataformas', detail: err.message });
    }
  },
};

module.exports = GameController;