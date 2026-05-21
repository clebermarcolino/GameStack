import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard'  },
  { to: '/players',   icon: '◈', label: 'Jogadores'   },
  { to: '/games',     icon: '◉', label: 'Jogos'       },
  { to: '/rankings',  icon: '◆', label: 'Rankings'    },
]

export default function Sidebar() {
  const navigate = useNavigate() 

  const handleLogout = () => {
    navigate('/')
  }

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
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'} style={({ isActive }) => ({
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

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)',
            fontWeight: 500, fontSize: 14, color: '#dc3545',
            background: 'transparent', border: 'none',
            cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fde8e8' }} 
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ display: 'block', margin: '0 auto' }}>
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
            </svg>
          </span>
          Sair
        </button>
      </div>
    </aside>
  )
}