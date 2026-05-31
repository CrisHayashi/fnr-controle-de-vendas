import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'

const Card: React.FC<{ title: string; value: number; color: string; icon: string }> = ({ title, value, color, icon }) => (
  <div style={{
    background: '#fff', borderRadius: 10, padding: '20px 24px',
    boxShadow: '0 2px 8px #0001', borderLeft: `5px solid ${color}`,
    flex: 1, minWidth: 160,
  }}>
    <div style={{ fontSize: 28 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 14, color: '#777', marginTop: 4 }}>{title}</div>
  </div>
)

const Dashboard: React.FC = () => {
  const [clientes, setClientes] = useState(0)
  const [fornecedores, setFornecedores] = useState(0)
  const [produtos, setProdutos] = useState(0)
  const [pedidosPorCliente, setPedidosPorCliente] = useState<{ nome: string; qtd: number }[]>([])
  const [pedidosPorMes, setPedidosPorMes] = useState<{ mes: string; qtd: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [c, f, p, ped] = await Promise.all([
        api.get('/clientes'),
        api.get('/fornecedores'),
        api.get('/produtos'),
        api.get('/pedidos'),
      ])
      setClientes(c.data.length)
      setFornecedores(f.data.length)
      setProdutos(p.data.length)

      const clientesMap: Record<number, string> = {}
      c.data.forEach((cl: any) => { clientesMap[cl.id] = cl.nome })

      const countCliente: Record<string, number> = {}
      ped.data.forEach((pe: any) => {
        const nome = clientesMap[pe.clienteId] || 'Desconhecido'
        countCliente[nome] = (countCliente[nome] || 0) + 1
      })
      setPedidosPorCliente(Object.entries(countCliente).map(([nome, qtd]) => ({ nome, qtd })))

      const countMes: Record<string, number> = {}
      ped.data.forEach((pe: any) => {
        if (pe.dtPedido) {
          const d = new Date(pe.dtPedido)
          const mes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          countMes[mes] = (countMes[mes] || 0) + 1
        }
      })
      setPedidosPorMes(
        Object.entries(countMes).sort(([a], [b]) => a.localeCompare(b)).map(([mes, qtd]) => ({ mes, qtd }))
      )
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <Card title="Clientes" value={clientes} color="#1976d2" icon="👥" />
        <Card title="Fornecedores" value={fornecedores} color="#388e3c" icon="🏭" />
        <Card title="Produtos" value={produtos} color="#f57c00" icon="📦" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px #0001' }}>
          <h3 style={{ marginBottom: 16 }}>Pedidos por Cliente</h3>
          {pedidosPorCliente.length === 0
            ? <p style={{ color: '#aaa' }}>Sem dados</p>
            : <Bar data={{
                labels: pedidosPorCliente.map(p => p.nome),
                datasets: [{ label: 'Pedidos', data: pedidosPorCliente.map(p => p.qtd), backgroundColor: '#1976d2' }],
              }} />
          }
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px #0001' }}>
          <h3 style={{ marginBottom: 16 }}>Pedidos por Mês</h3>
          {pedidosPorMes.length === 0
            ? <p style={{ color: '#aaa' }}>Sem dados</p>
            : <Bar data={{
                labels: pedidosPorMes.map(p => p.mes),
                datasets: [{ label: 'Pedidos', data: pedidosPorMes.map(p => p.qtd), backgroundColor: '#ffa726' }],
              }} />
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
