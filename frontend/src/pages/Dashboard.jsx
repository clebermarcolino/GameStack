import { useState, useEffect } from 'react'
import { playersApi, gamesApi, rankingsApi } from '../services/api'
import { StatCard, Card, Badge, Spinner } from '../components/ui'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [ranking, setRanking] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      playersApi.list({ limit: 1 }),
      gamesApi.list({ limit: 1 }),
      rankingsApi.list({ limit: 1 }),
      rankingsApi.global({ limit: 5 }),
      gamesApi.list({ limit: 5, page: 1 }),
    ]).then(([p, g, r, rank, recent]) => {
  setStats({
    players: p.pagination?.total ?? 0,
    games:   g.pagination?.total ?? 0,
    scores:  r.pagination?.total ?? 0,
  })
  setRanking(rank.data || [])
  setRecentGames(recent.data || [])
}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Spinner size={36} />
    </div>
  )

const medals = ['\u{1F947}', '\u{1F948}', '\u{1F949}']

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
          Visão geral do sistema GameStack
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="jogadores cadastrados" value={stats?.players} icon="◈" color="accent" />
        <StatCard label="jogos no sistema"      value={stats?.games}   icon="◉" color="gold"  />
        <StatCard label="pontuações registradas" value={stats?.scores} icon="◆" color="green" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card glow>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>
              {'\u{1F3C6}'} Ranking Geral
            </h2>
            <Badge color="gold">Top 5</Badge>
          </div>
          {ranking.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Sem pontuações ainda</p>
          ) : ranking.map((p, i) => (
            <div key={p.player_id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 0',
              borderBottom: i < ranking.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                {medals[i] || <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 13 }}>#{i + 1}</span>}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }} className="truncate">
                  {p.player_name}
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  @{p.username} · {p.total_partidas} partidas
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontWeight: 600, fontSize: 15 }}>
                {Number(p.total_score).toLocaleString()}
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Acesso Rápido
            </div>
            {[
              { label: 'Cadastrar Jogador', to: '/players', icon: '◈', color: 'var(--accent)' },
              { label: 'Adicionar Jogo',    to: '/games',   icon: '◉', color: 'var(--gold)' },
              { label: 'Registrar Pontuação', to: '/rankings', icon: '◆', color: 'var(--green)' },
            ].map(item => (
              <a key={item.to} href={item.to} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                borderBottom: '1px solid var(--border)', textDecoration: 'none',
                color: 'var(--text-primary)', transition: 'color 0.18s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = item.color}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                <span style={{ color: item.color, fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>{item.label}</span>
              </a>
            ))}
          </Card>
          <Card>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12}}>Últimos Jogos Adicionados</p>
            {recentGames.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Nenhum jogo foi adicionado recentemente</p>
            ) : recentGames.map((g, i) => (
              <div key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                borderBottom: i < recentGames.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }} className="truncate">{g.title}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{g.genre}</div>
                </div>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
                  background: 'var(--bg-base)', border: '1px solid var(--border)',
                  padding: '2px 7px', borderRadius: 100, whiteSpace: 'nowrap',
                }}>{g.platform || '—'}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
