import { createContext, useContext, useState, useCallback } from 'react'

const NotifContext = createContext(null)

export function NotifProvider({ children }) {
  const [notifs, setNotifs] = useState([])

  const push = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setNotifs(p => [...p, { id, msg, type }])
    setTimeout(() => setNotifs(p => p.filter(n => n.id !== id)), 3500)
  }, [])

  return (
    <NotifContext.Provider value={{ push }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map(n => (
          <div key={n.id} style={{
            background: '#ffffff',
            border: `1px solid ${n.type === 'error' ? 'var(--red)' : 'var(--accent)'}`,
            borderLeft: `4px solid ${n.type === 'error' ? 'var(--red)' : 'var(--accent)'}`,
            color: n.type === 'error' ? 'var(--red)' : 'var(--accent)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            animation: 'fadeIn 0.3s ease',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            maxWidth: 320,
          }}>
            {n.msg}
        </div>
        ))}
      </div>
    </NotifContext.Provider>
  )
}

export const useNotif = () => useContext(NotifContext)
