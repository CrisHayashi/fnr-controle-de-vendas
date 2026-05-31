import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const Cadastro: React.FC = () => {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await api.post('/cadastro', { nome, email, senha })
      setSucesso('Cadastro realizado com sucesso! Redirecionando...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao realizar cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1976d2 0%, #1e2a38 100%)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '40px 36px',
        minWidth: 400, boxShadow: '0 8px 32px #0004',
      }}>
        <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 8, fontSize: 24 }}>
          📦 Controle de Vendas
        </h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 28, fontSize: 14 }}>
          Criar nova conta
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nome */}
          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Nome completo</label>
            <input
              type="text" value={nome} onChange={e => setNome(e.target.value)}
              required placeholder="Seu nome"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="seu@email.com"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Senha */}
          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Senha</label>
            <input
              type="password" value={senha} onChange={e => setSenha(e.target.value)}
              required placeholder="Mínimo 6 caracteres"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Confirmar senha</label>
            <input
              type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)}
              required placeholder="Repita a senha"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 6,
                border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Erro */}
          {erro && (
            <div style={{
              background: '#fdecea', color: '#c62828', padding: '8px 12px',
              borderRadius: 6, fontSize: 13, textAlign: 'center',
            }}>
              {erro}
            </div>
          )}

          {/* Sucesso */}
          {sucesso && (
            <div style={{
              background: '#e8f5e9', color: '#2e7d32', padding: '8px 12px',
              borderRadius: 6, fontSize: 13, textAlign: 'center',
            }}>
              {sucesso}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: '#1976d2', color: '#fff', border: 'none',
            padding: '12px', borderRadius: 6, fontSize: 15, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 4, marginBottom: 0 }}>
            <span
              onClick={() => navigate('/')}
              style={{ color: '#1976d2', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Voltar para o login
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Cadastro
