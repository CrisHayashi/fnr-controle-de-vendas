import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #1976d2 0%, #1e2a38 100%)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '40px 36px',
        minWidth: 380, boxShadow: '0 8px 32px #0004',
      }}>
        <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 8, fontSize: 26 }}>
          📦 Controle de Vendas
        </h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 28, fontSize: 14 }}>
          Faça login para continuar
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="seu@email.com"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #ddd', fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #ddd', fontSize: 14, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fdecea', color: '#c62828', padding: '8px 12px',
              borderRadius: 6, fontSize: 13, textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: '#1976d2', color: '#fff', border: 'none',
            padding: '12px', borderRadius: 6, fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 4, marginBottom: 0 }}>
            <span
              onClick={() => navigate('/cadastro')}
              style={{ color: '#1976d2', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Primeiro cadastro
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
