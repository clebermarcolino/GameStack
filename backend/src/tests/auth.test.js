import { describe, it, expect} from 'vitest'
import request from 'supertest'
import app from '../../../server.js'

describe('Auth', () => {
  it('POST /auth/login — credenciais corretas retorna token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'useradmin', password: 'admin' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.username).toBe('useradmin')
  })

  it('POST /auth/login — credenciais erradas retorna 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'useradmin', password: 'senhaerrada' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('POST /auth/login — campos vazios retorna 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({})

    expect(res.status).toBe(400)
  })

  it('GET /players — sem token retorna 401', async () => {
    const res = await request(app).get('/api/v1/players')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Token não fornecido')
  })
})