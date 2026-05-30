import { describe, it, expect, beforeAll } from 'vitest'
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

describe('Games — CRUD', () => {
  it('GET /games — lista jogos', async () => {
    const res = await request(app)
      .get('/api/v1/games')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /games/genres — lista gêneros', async () => {
    const res = await request(app)
      .get('/api/v1/games/genres')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('POST /games — cria jogo com sucesso', async () => {
    const res = await request(app)
      .post('/api/v1/games')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Jogo Vitest',
        genre: 'RPG',
        developer: 'Vitest Studios',
        release_year: 2024,
        platform: 'PC',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Jogo Vitest')
    createdId = res.body.data.id
  })

  it('POST /games — campos obrigatórios faltando retorna 400', async () => {
    const res = await request(app)
      .post('/api/v1/games')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sem gênero' })

    expect(res.status).toBe(400)
  })

  it('GET /games/:id — busca jogo por ID', async () => {
    const res = await request(app)
      .get(`/api/v1/games/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe(createdId)
  })

  it('PUT /games/:id — atualiza jogo', async () => {
    const res = await request(app)
      .put(`/api/v1/games/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Atualizado pelo vitest' })

    expect(res.status).toBe(200)
    expect(res.body.data.description).toBe('Atualizado pelo vitest')
  })

  it('DELETE /games/:id — remove jogo', async () => {
    const res = await request(app)
      .delete(`/api/v1/games/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
  })

  it('GET /games/:id — ID inexistente retorna 404', async () => {
    const res = await request(app)
      .get('/api/v1/games/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
  })
})