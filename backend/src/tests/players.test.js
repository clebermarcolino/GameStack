import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../../server.js'

let token = ''
let createdId = null

beforeAll(async () => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'useradmin', password: 'admin' })
  token = res.body.token
})

describe('Players — CRUD', () => {
  it('GET /players — lista jogadores', async () => {
    const res = await request(app)
      .get('/api/v1/players')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('pagination')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('POST /players — cria jogador com sucesso', async () => {
    const res = await request(app)
      .post('/api/v1/players')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jogador Teste',
        email: 'teste_vitest@email.com',
        username: 'jogadorteste',
        bio: 'Criado pelo vitest',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.name).toBe('Jogador Teste')
    expect(res.body.data.email).toBe('teste_vitest@email.com')
    createdId = res.body.data.id
  })

  it('POST /players — email duplicado retorna 409', async () => {
    const res = await request(app)
      .post('/api/v1/players')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Outro Nome',
        email: 'teste_vitest@email.com',
        username: 'outrousername',
      })

    expect(res.status).toBe(409)
  })

  it('POST /players — campos obrigatórios faltando retorna 400', async () => {
    const res = await request(app)
      .post('/api/v1/players')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sem email' })

    expect(res.status).toBe(400)
  })

  it('GET /players/:id — busca jogador por ID', async () => {
    const res = await request(app)
      .get(`/api/v1/players/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(createdId)
  })

  it('GET /players/:id — ID inexistente retorna 404', async () => {
    const res = await request(app)
      .get('/api/v1/players/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })

  it('PUT /players/:id — atualiza jogador', async () => {
    const res = await request(app)
      .put(`/api/v1/players/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Bio atualizada pelo vitest' })

    expect(res.status).toBe(200)
    expect(res.body.data.bio).toBe('Bio atualizada pelo vitest')
  })

  it('DELETE /players/:id — remove jogador', async () => {
    const res = await request(app)
      .delete(`/api/v1/players/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toContain('sucesso')
  })

  it('DELETE /players/:id — ID inexistente retorna 404', async () => {
    const res = await request(app)
      .delete('/api/v1/players/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})