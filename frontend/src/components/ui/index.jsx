export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid var(--border)`,
      borderTop: `2px solid var(--accent)`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block',
    }} />
  )
}

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.04em',
    borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.18s ease', border: '1px solid transparent',
    ...style,
  }
  const sizes = { sm: { padding: '6px 14px', fontSize: 12 }, md: { padding: '10px 22px', fontSize: 13 }, lg: { padding: '13px 28px', fontSize: 14 } }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)'},
    ghost:   { background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border)' },
    danger:  { background: 'transparent', color: 'var(--red)', borderColor: 'var(--red)' },
    gold:    { background: 'var(--gold)', color: '#fff', borderColor: 'var(--gold)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={e => {
        if (disabled) return
        if (variant === 'ghost')   e.currentTarget.style.borderColor = 'var(--border-bright)'
        if (variant === 'danger')  { e.currentTarget.style.background = 'rgba(255,77,109,0.1)' }
      }}
      onMouseLeave={e => {
        if (disabled) return
        if (variant === 'ghost')   e.currentTarget.style.borderColor = 'var(--border)'
        if (variant === 'danger')  e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

export function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: 24,
      boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-card)',
      transition: 'border-color 0.2s',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>{label}</label>}
      <input {...props} style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        padding: '10px 14px',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.18s',
        width: '100%',
        ...props.style,
      }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}

export function Select({ label, options = [], ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>{label}</label>}
      <select {...props} style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        padding: '10px 14px',
        fontSize: 14,
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
        ...props.style,
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function Badge({ children, color = 'accent' }) {
  const colors = {
    accent: { bg: 'rgba(0,229,255,0.1)', text: 'var(--accent)', border: 'rgba(0,229,255,0.2)' },
    gold:   { bg: 'rgba(245,197,66,0.1)', text: 'var(--gold)', border: 'rgba(245,197,66,0.2)' },
    red:    { bg: 'rgba(255,77,109,0.1)', text: 'var(--red)', border: 'rgba(255,77,109,0.2)' },
    green:  { bg: 'rgba(0,229,160,0.1)', text: 'var(--green)', border: 'rgba(0,229,160,0.2)' },
    muted:  { bg: 'rgba(122,143,168,0.1)', text: 'var(--text-secondary)', border: 'rgba(122,143,168,0.2)' },
  }
  const c = colors[color] || colors.accent
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      padding: '3px 10px', borderRadius: 100, fontSize: 11,
      fontFamily: 'var(--font-mono)', fontWeight: 500, whiteSpace: 'nowrap',
    }}>{children}</span>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)', padding: 32, width: '100%', maxWidth: 520,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)', animation: 'fadeIn 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Empty({ icon = '◌', message = 'Nenhum dado encontrado' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>{icon}</div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{message}</p>
    </div>
  )
}

export function Confirm({ open, onClose, onConfirm, message }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar ação">
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="danger" onClick={onConfirm}>Confirmar</Btn>
      </div>
    </Modal>
  )
}

export function StatCard({ label, value, icon, color = 'accent' }) {
  const colors = { accent: 'var(--accent)', gold: 'var(--gold)', green: 'var(--green)', red: 'var(--red)' }
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius-sm)',
        background: `${colors[color]}18`, border: `1px solid ${colors[color]}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-display)', color: colors[color] }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{label}</div>
      </div>
    </Card>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>⌕</span>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
          padding: '10px 14px 10px 36px', fontSize: 14, outline: 'none',
          width: '100%', transition: 'border-color 0.18s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}
