import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps { children: React.ReactNode }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{
          flex: 1,
          padding: '24px',
          marginLeft: collapsed ? 60 : 220,
          marginTop: 64,
          transition: 'margin-left 0.3s',
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
