import { useState, useEffect, useCallback } from 'react'
import { rankingsApi, playersApi, gamesApi } from '../services/api'
import { useNotif } from '../context/NotifContext'
import { Btn, Card, Select, Modal, Confirm, Badge, Spinner, Empty, Input } from '../components/ui'

function RankingForm({ onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ player_id: '', game_id: '', score: '', level: '1' })
  const [players, setPlayers] = useState([])
  const [games, setGames] = useState([])
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    playersApi.list({ limit: 100 }).then(r => setPlayers(r.data))
    gamesApi.list({ limit: 100 }).then(r => setGames(r.data))
  }, [])

  const playerOpts = [{ value: '', label: 'Selecione o jogador' }, ...players.map(p => ({ value: p.id, label: `#${p.id} — ${p.name} (@${p.username})` }))]
  const gameOpts   = [{ value: '', label: 'Selecione o jogo' },   ...games.map(g => ({ value: g.id, label: `#${g.id} — ${g.title}` }))]

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, player_id: Number(form.player_id), game_id: Number(form.game_id), score: Number(form.score), level: Number(form.level) }) }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Select label="Jogador *" value={form.player_id} onChange={set('player_id')} options={playerOpts} required />
        <Select label="Jogo *"    value={form.game_id}   onChange={set('game_id')}   options={gameOpts}   required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Pontuação *" value={form.score} onChange={set('score')} type="number" placeholder="15000" required />
          <Input label="Nível"       value={form.level} onChange={set('level')} type="number" placeholder="1" min="1" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn type="submit" style={{ background: 'var(--green)', color: '#000', borderColor: 'var(--green)' }} disabled={loading}>
          {loading ? <Spinner size={14} /> : 'Registrar Pontuação'}
        </Btn>
      </div>
    </form>
  )
}

function EditForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ score: initial.score, level: initial.level })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ score: Number(form.score), level: Number(form.level) }) }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="Pontuação" value={form.score} onChange={set('score')} type="number" />
        <Input label="Nível"     value={form.level} onChange={set('level')} type="number" min="1" />
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn type="submit" disabled={loading}>{loading ? <Spinner size={14} /> : 'Salvar'}</Btn>
      </div>
    </form>
  )
}

const medals = [
  { emoji: '\u{1F947}', color: '#f5c542' },
  { emoji: '\u{1F948}', color: '#a8b8c8' },
  { emoji: '\u{1F949}', color: '#c87c3e' },
]

export default function Rankings() {
  const { push } = useNotif()
  const [tab, setTab] = useState('global')
  const [rankings, setRankings] = useState([])
  const [global, setGlobal] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      rankingsApi.global({ limit: 20 }),
      rankingsApi.list({ limit: 50 }),
    ]).then(([g, r]) => {
      setGlobal(g.data || [])
      setRankings(r.data || [])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (form) => {
    setSaving(true)
    try {
      await rankingsApi.create(form)
      push('Pontuação registrada!')
      setModal(null); load()
    } catch (e) { push(e.error || 'Erro ao registrar', 'error') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try {
      await rankingsApi.update(editModal.id, form)
      push('Pontuação atualizada!')
      setEditModal(null); load()
    } catch (e) { push(e.error || 'Erro ao atualizar', 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await rankingsApi.delete(confirm.id)
      push('Pontuação removida')
      setConfirm(null); load()
    } catch (e) { push(e.error || 'Erro ao remover', 'error') }
  }

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{
      padding: '8px 20px', borderRadius: 'var(--radius-sm)',
      background: tab === id ? 'var(--bg-hover)' : 'transparent',
      color: tab === id ? 'var(--text-primary)' : 'var(--text-muted)',
      border: `1px solid ${tab === id ? 'var(--border-bright)' : 'transparent'}`,
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
    }}>{label}</button>
  )

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Rankings</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            {rankings.length} pontuações registradas
          </p>
        </div>
        <Btn style={{ background: 'var(--green)', color: '#000', borderColor: 'var(--green)' }} onClick={() => setModal(true)}>
          ◆ Nova Pontuação
        </Btn>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-sm)', width: 'fit-content', border: '1px solid var(--border)' }}>
          <TabBtn id="global" label={'\u{1F3C6} Ranking Geral'}/>
          <TabBtn id="all"    label={'\u{1F4CB} Todas as Pontuações'}/>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>
      ) : tab === 'global' ? (
        /* ── GLOBAL RANKING ── */
        <div style={{ display: 'grid', gap: 12 }}>
          {global.length === 0 ? <Empty icon="◆" message="Nenhuma pontuação ainda" /> : global.map((p, i) => {
            const medal = medals[i]
            return (
              <Card key={p.player_id} style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: '18px 24px',
                borderColor: i === 0 ? 'rgba(245,197,66,0.3)' : 'var(--border)',
                background: i === 0 ? 'linear-gradient(90deg, rgba(245,197,66,0.05) 0%, var(--bg-card) 100%)' : 'var(--bg-card)',
              }}>
                {/* Position */}
                <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                  {medal
                    ? <span style={{ fontSize: 24 }}>{medal.emoji}</span>
                    : <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', fontSize: 15 }}>#{i + 1}</span>
                  }
                </div>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                  background: `hsl(${(p.player_id * 47) % 360}, 60%, 20%)`,
                  border: `2px solid ${medal ? medal.color : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16, color: `hsl(${(p.player_id * 47) % 360}, 80%, 70%)`,
                }}>
                  {p.player_name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{p.player_name}</div>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    @{p.username} · {p.total_partidas} partidas · melhor: {Number(p.best_score).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: medal ? medal.color : 'var(--text-primary)' }}>
                    {Number(p.total_score).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>pontos totais</div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {rankings.length === 0 ? <Empty icon="◆" message="Nenhuma pontuação encontrada" /> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Jogador', 'Jogo', 'Pontuação', 'Nível', 'Data', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < rankings.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 20px' }}><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: 13 }}>#{r.id}</span></td>
                    <td style={{ padding: '13px 20px', fontWeight: 600, fontSize: 14 }}>{r.player_name}</td>
                    <td style={{ padding: '13px 20px' }}><Badge color="muted">{r.game_title}</Badge></td>
                    <td style={{ padding: '13px 20px', fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontWeight: 700 }}>{Number(r.score).toLocaleString()}</td>
                    <td style={{ padding: '13px 20px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: 13 }}>Lv. {r.level}</td>
                    <td style={{ padding: '13px 20px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 12 }}>
                      {new Date(r.played_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn size="sm" variant="ghost" onClick={() => setEditModal(r)}>Editar</Btn>
                        <Btn size="sm" variant="danger" onClick={() => setConfirm(r)}>✕</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title="Nova Pontuação">
        <RankingForm onSubmit={handleCreate} onClose={() => setModal(null)} loading={saving} />
      </Modal>
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Editar Pontuação">
        {editModal && <EditForm initial={editModal} onSubmit={handleUpdate} onClose={() => setEditModal(null)} loading={saving} />}
      </Modal>
      <Confirm
        open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete}
        message={`Remover pontuação de "${confirm?.player_name}" em "${confirm?.game_title}"?`}
      />
    </div>
  )
}
