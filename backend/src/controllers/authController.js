const jwt  = require('jsonwebtoken')
const { query } = require('../config/database')

const SECRET = process.env.JWT_SECRET || 'gamestack_secret'

const AuthController = {

  async register(req, res) {
    try {
      const { username, password } = req.body
      if (!username || !password)
        return res.status(400).json({ error: 'Username e senha são obrigatórios' })

      const exists = await query('SELECT id FROM admins WHERE username = $1', [username])
      if (exists.rows.length)
        return res.status(409).json({ error: 'Username já cadastrado' })

      const result = await query(
        'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
        [username, password]
      )

      res.status(201).json({ data: result.rows[0], message: 'Admin criado com sucesso' })
    } catch (e) {
      res.status(500).json({ error: 'Erro ao criar admin', detail: e.message })
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body
      if (!username || !password)
        return res.status(400).json({ error: 'Username e senha são obrigatórios' })

      const result = await query('SELECT * FROM admins WHERE username = $1', [username])
      const admin  = result.rows[0]

      if (!admin || admin.password !== password)
        return res.status(401).json({ error: 'Usuário ou senha inválidos' })

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        SECRET,
        { expiresIn: '8h' }
      )

      res.json({ token, user: { id: admin.id, username: admin.username } })
    } catch (e) {
      res.status(500).json({ error: 'Erro ao fazer login', detail: e.message })
    }
  },

  verify(req, res) {
    res.json({ valid: true, user: req.user })
  },
}

module.exports = AuthController