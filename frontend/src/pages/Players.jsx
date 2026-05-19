import { useState, useEffect, useCallback } from 'react'
import { playersApi } from '../services/api'
import { useNotif } from '../context/NotifContext'
import { Btn, Card, Input, Modal, Confirm, Badge, SearchBar, Spinner, Empty } from '../components/ui'

function PlayerForm({ initial = {}, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ name: '', email: '', username: '', bio: '', avatar_url: '', ...initial })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Input label="Nome *"     value={form.name}       onChange={set('name')}       placeholder="Ex: Lucas Silva"       required />
        <Input label="Email *"    value={form.email}      onChange={set('email')}      placeholder="lucas@email.com"       type="email" required />
        <Input label="Username *" value={form.username}   onChange={set('username')}   placeholder="lsilva"                required />
        <Input label="Bio"        value={form.bio}        onChange={set('bio')}        placeholder="Conte um pouco sobre o jogador..." />
        <Input label="Avatar URL" value={form.avatar_url} onChange={set('avatar_url')} placeholder="https://..." />
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

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Jogadores</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            {pagination.total ?? '...'} jogadores cadastrados
          </p>
        </div>
        <Btn onClick={() => setModal('create')}>◈ Novo Jogador</Btn>
      </div>

      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, username, email..." />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner /></div>
        ) : players.length === 0 ? (
          <Empty icon="◈" message="Nenhum jogador encontrado" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Jogador', 'Email', 'Username', 'Bio', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{h}</th>
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
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 13 }}>#{p.id}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: `hsl(${(p.id * 47) % 360}, 60%, 25%)`,
                        border: '1px solid var(--border)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: `hsl(${(p.id * 47) % 360}, 80%, 75%)`,
                      }}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>{p.email}</td>
                  <td style={{ padding: '14px 20px' }}><Badge color="muted">@{p.username}</Badge></td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13, maxWidth: 180 }}>
                    <span className="truncate" style={{ display: 'block', maxWidth: 160 }}>{p.bio || '—'}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
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
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              background: n === page ? 'var(--accent)' : 'var(--bg-surface)',
              color: n === page ? '#000' : 'var(--text-secondary)',
              border: '1px solid var(--border)', fontFamily: 'var(--font-mono)',
              fontSize: 13, cursor: 'pointer', fontWeight: n === page ? 700 : 400,
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
