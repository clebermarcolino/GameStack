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
            background: n.type === 'error' ? '#1a0a10' : '#0a1a14',
            border: `1px solid ${n.type === 'error' ? 'var(--red)' : 'var(--green)'}`,
            color: n.type === 'error' ? 'var(--red)' : 'var(--green)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            animation: 'fadeIn 0.3s ease',
            boxShadow: n.type === 'error'
              ? '0 4px 20px rgba(255,77,109,0.2)'
              : '0 4px 20px rgba(0,229,160,0.2)',
            maxWidth: 320,
          }}>
            {n.type === 'error' ? '✗ ' : '✓ '}{n.msg}
          </div>
        ))}
      </div>
    </NotifContext.Provider>
  )
}

export const useNotif = () => useContext(NotifContext)
