import { useState, useEffect, useCallback } from 'react'
import { playersApi } from '../services/api'
import { useNotif } from '../context/NotifContext'
import { Btn, Card, Input, Modal, Confirm, Badge, SearchBar, Spinner, Empty } from '../components/ui'

function PlayerForm({ initial = {}, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ name: '', email: '', username: '', bio: '', avatar_url: '', ...initial })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  function handleAvatar(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande! Máximo 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm(p => ({ ...p, avatar_url: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }}>
      <div style={{ display: 'grid', gap: 16 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
            Avatar
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
              background: 'var(--accent-light)', border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', color: 'var(--accent)',
            }}>
              {form.avatar_url
                ? <img src={form.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontWeight: 700, fontSize: 22 }}>{form.name ? form.name.charAt(0).toUpperCase() : '?'}</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="avatar-upload" style={{
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
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
              {form.avatar_url && (
                <button type="button" onClick={() => setForm(p => ({ ...p, avatar_url: '' }))}
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

        <Input label="Nome *"     value={form.name}     onChange={set('name')}     placeholder="Adicione um nome" required />
        <Input label="Email *"    value={form.email}    onChange={set('email')}    placeholder="email@email ..." type="email" required />
        <Input label="Username *" value={form.username} onChange={set('username')} placeholder="Adicione um nome de usuário"          required />
        <Input label="Bio"        value={form.bio}      onChange={set('bio')}      placeholder="Conte um pouco sobre o jogador..." />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn type="submit" disabled={loading}>{loading ? <Spinner size={14} /> : (initial.id ? 'Salvar' : 'Criar Jogador')}</Btn>
      </div>
    </form>
  )
}

export default function Players() {
  const { push } = useNotif()
  const [players, setPlayers] = useState([])
  const [pagination, setPagination] = useState({})
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    playersApi.list({ search: search || undefined, page, limit: 10 })
      .then(r => { setPlayers(r.data); setPagination(r.pagination) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  const handleCreate = async (form) => {
    setSaving(true)
    try {
      await playersApi.create(form)
      push('Jogador criado com sucesso!')
      setModal(null); load()
    } catch (e) { push(e.error || 'Erro ao criar', 'error') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try {
      await playersApi.update(modal.id, form)
      push('Jogador atualizado!')
      setModal(null); load()
    } catch (e) { push(e.error || 'Erro ao atualizar', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await playersApi.delete(confirm.id)
      push('Jogador removido')
      setConfirm(null); load()
    } catch (e) { push(e.error || 'Erro ao remover', 'error') }
  }

  function Avatar({ player }) {
    if (player.avatar_url) {
      return (
        <img src={player.avatar_url} alt={player.name}
          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: 'var(--accent-light)', color: 'var(--accent)',
        border: '1px solid var(--border)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700,
      }}>
        {player.name.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Jogadores</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            {pagination.total ?? '...'} jogadores cadastrados
          </p>
        </div>
        <Btn onClick={() => setModal('create')}>Novo Jogador</Btn>
      </div>

      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, username ou email" />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
        ) : players.length === 0 ? (
          <Empty icon="○" message="Nenhum jogador encontrado" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-base)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Jogador', 'Email', 'Username', 'Bio', ''].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} style={{
                  borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar player={p} />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', color: 'var(--text-secondary)', fontSize: 13 }}>{p.email}</td>
                  <td style={{ padding: '13px 18px' }}><Badge color="muted">@{p.username}</Badge></td>
                  <td style={{ padding: '13px 18px', color: 'var(--text-secondary)', fontSize: 13 }}>
                    <span className="truncate" style={{ display: 'block', maxWidth: 160 }}>{p.bio || '—'}</span>
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Btn size="sm" variant="ghost" onClick={() => setModal(p)}>Editar</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setConfirm(p)}>Excluir</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} style={{
              width: 34, height: 34, borderRadius: 'var(--radius-sm)',
              background: n === page ? 'var(--accent)' : '#fff',
              color: n === page ? '#fff' : 'var(--text-secondary)',
              border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer',
            }}>{n}</button>
          ))}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Novo Jogador">
        <PlayerForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} />
      </Modal>
      <Modal open={!!modal && modal !== 'create'} onClose={() => setModal(null)} title="Editar Jogador">
        <PlayerForm initial={modal || {}} onSubmit={handleUpdate} onClose={() => setModal(null)} loading={saving} />
      </Modal>
      <Confirm
        open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete}
        message={`Remover o jogador "${confirm?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}