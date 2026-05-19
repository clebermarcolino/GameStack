import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data || err)
)

export const playersApi = {
  list:   (params) => api.get('/players', { params }),
  get:    (id)     => api.get(`/players/${id}`),
  create: (data)   => api.post('/players', data),
  update: (id, d)  => api.put(`/players/${id}`, d),
  delete: (id)     => api.delete(`/players/${id}`),
}

export const gamesApi = {
  list:      (params) => api.get('/games', { params }),
  get:       (id)     => api.get(`/games/${id}`),
  genres:    ()       => api.get('/games/genres'),
  platforms: ()       => api.get('/games/platforms'),
  create:    (data)   => api.post('/games', data),
  update:    (id, d)  => api.put(`/games/${id}`, d),
  delete:    (id)     => api.delete(`/games/${id}`),
}

export const rankingsApi = {
  list:     (params)    => api.get('/rankings', { params }),
  global:   (params)    => api.get('/rankings/global', { params }),
  byGame:   (gId, p)   => api.get(`/rankings/game/${gId}`, { params: p }),
  byPlayer: (pId, p)   => api.get(`/rankings/player/${pId}`, { params: p }),
  create:   (data)      => api.post('/rankings', data),
  update:   (id, d)     => api.put(`/rankings/${id}`, d),
  delete:   (id)        => api.delete(`/rankings/${id}`),
}

export default api
