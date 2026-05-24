import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';                

export default function Login({}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { saveSession } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/auth/login', { username, password });
      saveSession(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    body: {
      background: 'linear-gradient(135deg, #1b2b22 0%, #0f1a14 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      padding: 20,
      boxSizing: 'border-box',
    },
    loginCard: {
      width: '100%',
      maxWidth: 420,
      borderRadius: '1rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
    },
    loginHeader: {
      background: 'linear-gradient(135deg, #243e30, #1b2b22)',
      padding: '2rem',
      textAlign: 'center',
      color: 'white',
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      margin: '0 0 0.25rem 0',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      opacity: 0.85,
      margin: 0,
    },
    cardBody: {
      padding: '1.5rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#6c757d',
      fontWeight: 500,
    },
    alertDanger: {
      backgroundColor: '#f8d7da',
      color: '#842029',
      border: '1px solid #f5c2c7',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
    },
    alertSuccess: {
      backgroundColor: '#d1e7dd',
      color: '#0f5132',
      border: '1px solid #badbcc',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
    },
    mb3: {
      marginBottom: '1rem',
    },
    mb4: {
      marginBottom: '1.5rem',
    },
    formLabel: {
      display: 'inline-block',
      marginBottom: '0.5rem',
      fontWeight: 600,
      fontSize: '0.875rem',
      color: '#212529',
    },
    inputGroup: {
      display: 'flex',
      width: '100%',
    },
    inputGroupText: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      fontWeight: 400,
      color: '#212529',
      textAlign: 'center',
      backgroundColor: '#e9ecef',
      border: '1px solid #ced4da',
      borderRadius: '0.375rem 0 0 0.375rem',
    },
    formControl: {
      flex: '1 1 auto',
      width: '1%',
      padding: '0.375rem 0.75rem',
      fontSize: '1rem',
      fontWeight: 400,
      color: '#212529',
      backgroundColor: '#fff',
      border: '1px solid #ced4da',
      borderRadius: '0 0.375rem 0.375rem 0',
      outline: 'none',
    },
    dGrid: {
      display: 'grid',
    },
    btnPrimary: {
      padding: '0.5rem 1rem',
      fontSize: '1.25rem',
      borderRadius: '0.3rem',
      color: '#fff',
      backgroundColor: '#243e30',
      border: '1px solid #1b2b22',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      transition: 'background-color 0.15s ease-in-out',
    },
    devBadge: {
      marginTop: '1rem',
      padding: '0.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0.25rem',
      border: '1px solid #dee2e6',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#6c757d',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginCard}>
        
        <div style={styles.loginHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="white"
               style={{ marginBottom: '0.5rem' }} viewBox="0 0 16 16">
            <path d="M11.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1.2 4.953-.493 3.948a.5.5 0 0 1-.914.188l-1.036-1.619-1.342 1.43a.5.5 0 0 1-.796-.539l.716-2.41-1.314-1.213a.5.5 0 0 1 .288-.853l2.251-.21 1.096-2.133a.5.5 0 0 1 .896 0l1.1 2.133 2.25.21a.5.5 0 0 1 .289.853L11.5 8.324a.5.5 0 0 1-.131.428l-.069.057z"/>
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.394 13.115l.59-2.011a.5.5 0 0 1 .744-.326l1.344.757a.5.5 0 0 0 .546-.041l2.062-1.536a.5.5 0 0 1 .707.135l1.084 1.74a7 7 0 1 0-7.077 1.282z"/>
          </svg>
          <h1 style={styles.headerTitle}>GameStack</h1>
          <p style={styles.headerSubtitle}>Sistema de Processamento Transacional para Games</p>
        </div>

        <div style={styles.cardBody}>

          {error && (
            <div style={styles.alertDanger} role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   style={{ marginRight: '0.5rem', flexShrink: 0 }} viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              <div>{error}</div>
            </div>
          )}

          <h2 style={styles.cardTitle}>Acesse sua conta</h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.mb3}>
              <label htmlFor="username" style={styles.formLabel}>Usuário</label>
              <div style={styles.inputGroup}>
                <span style={styles.inputGroupText}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                       fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                  </svg>
                </span>
                <input 
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.formControl}
                  placeholder="Digite seu usuário"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div style={styles.mb4}>
              <label htmlFor="password" style={styles.formLabel}>Senha</label>
              <div style={styles.inputGroup}>
                <span style={styles.inputGroupText}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                       fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                  </svg>
                </span>
                <input 
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.formControl}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div style={styles.dGrid}>
              <button 
                type="submit" 
                disabled={loading}
                style={styles.btnPrimary}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1b2b22'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#243e30'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     fill="currentColor" style={{ marginRight: '0.5rem' }} viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                  <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
                Entrar
              </button>
            </div>

          </form>

          <div style={styles.devBadge}>
            <small>
              <strong>Acesso Livre:</strong> useradmin / admin
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}