import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
      background: '#1976d2', color: '#fff', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between', padding: '0 24px',
      boxShadow: '0 2px 6px #0003',
    }}>
      <span style={{ fontSize: 20, fontWeight: 700 }}>📦 Controle de Vendas</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && <span style={{ fontSize: 14 }}>👤 {user.email}</span>}
        <button onClick={handleLogout} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
          padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 14,
        }}>Sair</button>
      </div>
    </nav>
  )
}

export default Navbar
