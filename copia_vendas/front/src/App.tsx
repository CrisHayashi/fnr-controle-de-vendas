import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import Layout from './components/layout/Layout'
import DemoExpirado from './components/DemoExpirado/DemoExpirado'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Clientes from './pages/Clientes/Clientes'
import Fornecedores from './pages/Fornecedores/Fornecedores'
import Pedidos from './pages/Pedidos/Pedidos'
import Produtos from './pages/Produtos/Produtos'
import Categorias from './pages/Categorias/Categorias'
import Vendedores from './pages/Vendedores/Vendedores'
import Agenda from './pages/Agenda/Agenda'
import Cadastro from './pages/Cadastro/Cadastro'

const privateRoute = (component: React.ReactNode) => (
  <PrivateRoute>
    <Layout>{component}</Layout>
  </PrivateRoute>
)

function App() {
  const expirado = new Date() > new Date('2026-07-10T23:59:59')
  if (expirado) return <DemoExpirado />

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={privateRoute(<Dashboard />)} />
          <Route path="/clientes" element={privateRoute(<Clientes />)} />
          <Route path="/fornecedores" element={privateRoute(<Fornecedores />)} />
          <Route path="/pedidos" element={privateRoute(<Pedidos />)} />
          <Route path="/produtos" element={privateRoute(<Produtos />)} />
          <Route path="/categorias" element={privateRoute(<Categorias />)} />
          <Route path="/vendedores" element={privateRoute(<Vendedores />)} />
          <Route path="/agenda" element={privateRoute(<Agenda />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
