import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',         icon: '⊞', label: 'Dashboard'  },
  { to: '/players',  icon: '◈', label: 'Jogadores'   },
  { to: '/games',    icon: '◉', label: 'Jogos'       },
  { to: '/rankings', icon: '◆', label: 'Rankings'    },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 224, flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
    }}>
      <div style={{ padding: '28px 24px 22px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700,
          }}>G</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              GameStack
            </div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', padding: '0 10px', marginBottom: 8, textTransform: 'uppercase' }}>
          Menu
        </div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 'var(--radius-sm)',
            fontWeight: isActive ? 600 : 500, fontSize: 14,
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-light)' : 'transparent',
            marginBottom: 2, transition: 'all 0.15s', textDecoration: 'none',
          })}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => {
              const active = e.currentTarget.getAttribute('aria-current') === 'page'
              e.currentTarget.style.background = active ? 'var(--accent-light)' : 'transparent'
            }}
          >
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}