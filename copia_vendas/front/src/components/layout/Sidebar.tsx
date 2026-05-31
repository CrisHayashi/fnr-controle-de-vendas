import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FaHome, FaUsers, FaShoppingCart, FaBoxOpen,
  FaCalendarAlt, FaTruck, FaTags, FaUserTie,
} from 'react-icons/fa'

const menu = [
  { label: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
  { label: 'Clientes', icon: <FaUsers />, path: '/clientes' },
  { label: 'Fornecedores', icon: <FaTruck />, path: '/fornecedores' },
  { label: 'Pedidos', icon: <FaShoppingCart />, path: '/pedidos' },
  { label: 'Vendedores', icon: <FaUserTie />, path: '/vendedores' },
  { label: 'Categorias', icon: <FaTags />, path: '/categorias' },
  { label: 'Produtos', icon: <FaBoxOpen />, path: '/produtos' },
  { label: 'Agenda', icon: <FaCalendarAlt />, path: '/agenda' },
]

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside style={{
      position: 'fixed', top: 64, left: 0, bottom: 0,
      width: collapsed ? 60 : 220, background: '#1e2a38', color: '#fff',
      transition: 'width 0.3s', zIndex: 99, overflowX: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <button onClick={() => setCollapsed(!collapsed)} style={{
        background: 'none', border: 'none', color: '#fff', fontSize: 18,
        padding: '10px', cursor: 'pointer', alignSelf: 'flex-end',
      }}>
        {collapsed ? '»' : '«'}
      </button>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menu.map(item => {
          const active = location.pathname === item.path
          return (
            <li key={item.label} onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', cursor: 'pointer',
                background: active ? '#1976d2' : 'transparent',
                borderLeft: active ? '3px solid #90caf9' : '3px solid transparent',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#2e3e52' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: 18, minWidth: 24, textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && <span style={{ fontSize: 14 }}>{item.label}</span>}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Sidebar
