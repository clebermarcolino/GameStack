const PlayerModel = require('../models/playerModel');

const PlayerController = {
  async index(req, res) {
    try {
      const { search, limit = 20, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const [players, total] = await Promise.all([
        PlayerModel.findAll({ search, limit: Number(limit), offset: Number(offset) }),
        PlayerModel.count({ search }),
      ]);

      res.json({
        data: players,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar jogadores', detail: err.message });
    }
  },

  async show(req, res) {
    try {
      const player = await PlayerModel.findById(req.params.id);
      if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });
      res.json({ data: player });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar jogador', detail: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name, email, username, avatar_url, bio } = req.body;

      if (!name || !email || !username) {
        return res.status(400).json({ error: 'Campos obrigatórios: name, email, username' });
      }

      const emailExists = await PlayerModel.findByEmail(email);
      if (emailExists) return res.status(409).json({ error: 'Email já cadastrado' });

      const usernameExists = await PlayerModel.findByUsername(username);
      if (usernameExists) return res.status(409).json({ error: 'Username já cadastrado' });

      const player = await PlayerModel.create({ name, email, username, avatar_url, bio });
      res.status(201).json({ data: player, message: 'Jogador criado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar jogador', detail: err.message });
    }
  },

  async update(req, res) {
    try {
      const player = await PlayerModel.findById(req.params.id);
      if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });

      const { name, email, username, avatar_url, bio } = req.body;

      if (email && email !== player.email) {
        const exists = await PlayerModel.findByEmail(email);
        if (exists) return res.status(409).json({ error: 'Email já cadastrado' });
      }
      if (username && username !== player.username) {
        const exists = await PlayerModel.findByUsername(username);
        if (exists) return res.status(409).json({ error: 'Username já cadastrado' });
      }

      const updated = await PlayerModel.update(req.params.id, { name, email, username, avatar_url, bio });
      res.json({ data: updated, message: 'Jogador atualizado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar jogador', detail: err.message });
    }
  },

  async destroy(req, res) {
    try {
      const player = await PlayerModel.findById(req.params.id);
      if (!player) return res.status(404).json({ error: 'Jogador não encontrado' });

      await PlayerModel.delete(req.params.id);
      res.json({ message: 'Jogador removido com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover jogador', detail: err.message });
    }
  },
};

module.exports = PlayerController;
