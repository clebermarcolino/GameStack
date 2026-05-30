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

describe('Rankings — CRUD', () => {
  it('GET /rankings — lista pontuações', async () => {
    const res = await request(app)
      .get('/api/v1/rankings')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /rankings/global — ranking global', async () => {
    const res = await request(app)
      .get('/api/v1/rankings/global')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('POST /rankings — registra pontuação com sucesso', async () => {
    const playersRes = await request(app)
      .get('/api/v1/players')
      .set('Authorization', `Bearer ${token}`)
    const gamesRes = await request(app)
      .get('/api/v1/games')
      .set('Authorization', `Bearer ${token}`)

    const player_id = playersRes.body.data[0].id
    const game_id   = gamesRes.body.data[0].id

    const res = await request(app)
      .post('/api/v1/rankings')
      .set('Authorization', `Bearer ${token}`)
      .send({ player_id, game_id, score: 99999, level: 10 })

    expect(res.status).toBe(201)
    expect(res.body.data.score).toBe(99999)
    createdId = res.body.data.id
  })

  it('POST /rankings — campos faltando retorna 400', async () => {
    const res = await request(app)
      .post('/api/v1/rankings')
      .set('Authorization', `Bearer ${token}`)
      .send({ player_id: 1 })

    expect(res.status).toBe(400)
  })

  it('PUT /rankings/:id — atualiza pontuação', async () => {
    const res = await request(app)
      .put(`/api/v1/rankings/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 111111, level: 99 })

    expect(res.status).toBe(200)
    expect(res.body.data.score).toBe(111111)
  })

  it('DELETE /rankings/:id — remove pontuação', async () => {
    const res = await request(app)
      .delete(`/api/v1/rankings/${createdId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
  })
})