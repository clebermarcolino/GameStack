import { useState, useEffect, useCallback } from 'react'
import { gamesApi } from '../services/api'
import { useNotif } from '../context/NotifContext'
import { Btn, Card, Input, Select, Modal, Confirm, Badge, SearchBar, Spinner, Empty } from '../components/ui'

const GENRES = ['', 'Ação', 'Aventura', 'RPG', 'Plataforma', 'Roguelite', 'Metroidvania', 'Simulação', 'Estratégia', 'Party', 'FPS', 'Luta', 'Esporte', 'Puzzle', 'Outro']
const PLATFORMS = ['', 'PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Multi-plataforma']

const GENRE_COLORS = { Roguelite: 'red', Metroidvania: 'accent', RPG: 'gold', Plataforma: 'green', Simulação: 'muted', Party: 'gold', FPS: 'red', Ação: 'red' }

function GameForm({ initial = {}, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ title: '', genre: '', description: '', developer: '', release_year: '', platform: '', cover_url: '', ...initial })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  function handleCover(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande! Máximo 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm(p => ({ ...p, cover_url: reader.result }))
    reader.readAsDataURL(file)
  }

  const genreOptions = GENRES.map(g => ({ value: g, label: g || 'Selecione o gênero' }))
  const platformOptions = PLATFORMS.map(p => ({ value: p, label: p || 'Selecione a plataforma' }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Input label="Título *" value={form.title} onChange={set('title')} placeholder="Adicione o título" required />
        </div>
        <Select label="Gênero *"   value={form.genre}    onChange={set('genre')}    options={genreOptions} required />
        <Select label="Plataforma" value={form.platform} onChange={set('platform')} options={platformOptions} />
        <Input label="Desenvolvedor" value={form.developer}    onChange={set('developer')}    placeholder="Adicione o desenvolvedor" />
        <Input label="Ano"           value={form.release_year} onChange={set('release_year')} type="number" placeholder="Adicione o ano" />
        <div style={{ gridColumn: '1 / -1' }}>
          <Input label="Descrição" value={form.description} onChange={set('description')} placeholder="Breve descrição do jogo..." />
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            Capa do Jogo
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 80, height: 64, borderRadius: 8, flexShrink: 0,
              background: form.cover_url ? 'transparent' : 'var(--accent-light)',
              border: '2px solid var(--border)', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)', fontSize: 22,
            }}>
              {form.cover_url
                ? <img src={form.cover_url} alt="capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '◉'
              }
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="cover-upload" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-base)', border: '1px solid var(--border)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                color: 'var(--text-secondary)', transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {'\u{1F4C1}'} Escolher imagem
              </label>
              <input id="cover-upload" type="file" accept="image/*" onChange={handleCover} style={{ display: 'none' }} />
              {form.cover_url && (
                <button type="button" onClick={() => setForm(p => ({ ...p, cover_url: '' }))}
                  style={{ marginLeft: 8, fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Remover
                </button>
              )}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                Adicione uma imagem
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn type="submit" disabled={loading}>{loading ? <Spinner size={14} /> : (initial.id ? 'Salvar' : 'Criar Jogo')}</Btn>
      </div>
    </form>
  )
}

export default function Games() {
  const { push } = useNotif()
  const [games, setGames] = useState([])
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    gamesApi.list({ search: search || undefined, genre: genreFilter || undefined, page, limit: 10 })
      .then(r => { setGames(r.data); setPagination(r.pagination) })
      .finally(() => setLoading(false))
  }, [search, genreFilter, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, genreFilter])

  const handleCreate = async (form) => {
    setSaving(true)
    try {
      await gamesApi.create(form)
      push('Jogo criado com sucesso!')
      setModal(null); load()
    } catch (e) { push(e.error || 'Erro ao criar', 'error') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try {
      await gamesApi.update(modal.id, form)
      push('Jogo atualizado!')
      setModal(null); load()
    } catch (e) { push(e.error || 'Erro ao atualizar', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await gamesApi.delete(confirm.id)
      push('Jogo removido')
      setConfirm(null); load()
    } catch (e) { push(e.error || 'Erro ao remover', 'error') }
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Jogos</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            {pagination.total ?? '...'} jogos cadastrados
          </p>
        </div>
        <Btn variant="gold" onClick={() => setModal('create')}>Novo Jogo</Btn>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por título" />
        </div>
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)} style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', color: genreFilter ? 'var(--text-primary)' : 'var(--text-muted)',
          padding: '10px 14px', fontSize: 13, cursor: 'pointer', outline: 'none',
        }}>
          <option value="">Todos os gêneros</option>
          {GENRES.filter(Boolean).map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
      ) : games.length === 0 ? (
        <Empty icon="◉" message="Nenhum jogo encontrado" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          {games.map(g => (
            <div key={g.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', overflow: 'hidden',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{
                height: 120, background: g.cover_url
                  ? `url(${g.cover_url}) center/cover no-repeat`
                  : `linear-gradient(135deg, hsl(${(g.id * 73) % 360}, 40%, 12%), hsl(${(g.id * 73 + 60) % 360}, 40%, 18%))`,
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <Badge color={GENRE_COLORS[g.genre] || 'muted'}>{g.genre}</Badge>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }} className="truncate">
                  {g.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                  {g.developer || '—'} · {g.release_year || '—'}
                </div>
                {g.platform && (
                  <Badge color="muted">{g.platform}</Badge>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <Btn size="sm" variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(g)}>Editar</Btn>
                  <Btn size="sm" variant="danger" onClick={() => setConfirm(g)}>Excluir</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: n === page ? 'var(--gold)' : 'var(--bg-surface)',
              color: n === page ? '#000' : 'var(--text-secondary)',
              border: '1px solid var(--border)', fontFamily: 'var(--font-mono)',
              fontSize: 13, cursor: 'pointer',
            }}>{n}</button>
          ))}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Novo Jogo">
        <GameForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} />
      </Modal>
      <Modal open={!!modal && modal !== 'create'} onClose={() => setModal(null)} title="Editar Jogo">
      <GameForm 
        key={modal?.id}
        initial={modal || {}} 
        onSubmit={handleUpdate} 
        onClose={() => setModal(null)} 
        loading={saving} 
      />
      </Modal>
      <Confirm
        open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete}
        message={`Remover o jogo "${confirm?.title}"? Todas as pontuações associadas serão removidas.`}
      />
    </div>
  )
}
