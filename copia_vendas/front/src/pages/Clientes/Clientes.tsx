import React, { useEffect, useState } from 'react'
import api from '../../services/api'

interface Campo {
  key: string
  label: string
  type?: string
  required?: boolean
}

const campos: Campo[] = [
  { key: 'nome', label: 'Nome', required: true },
  { key: 'cpfCnpj', label: 'CPF/CNPJ', required: true },
  { key: 'responsavel', label: 'Responsável', required: true },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'iEst', label: 'Inscrição Estadual' },
  { key: 'iMuni', label: 'Inscrição Municipal' },
]

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [erro, setErro] = useState('')
  const [inativo, setInativo] = useState(false)
  const [busca, setBusca] = useState('')

  const fetchClientes = async () => {
    setLoading(true)
    const res = await api.get(`/clientes?inativo=${inativo}${busca ? `&nome=${busca}` : ''}`)
    setClientes(res.data)
    setLoading(false)
  }

  useEffect(() => { fetchClientes() }, [inativo, busca])

  const openModal = (cliente?: any) => {
    setEditing(cliente || null)
    setForm(cliente || {})
    setErro('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setErro('')
    try {
      if (editing) {
        await api.put(`/clientes/${editing.id}`, form)
      } else {
        await api.post('/clientes', form)
      }
      setShowModal(false)
      fetchClientes()
    } catch (e: any) {
      setErro(e.response?.data?.detail || 'Erro ao salvar')
    }
  }

  const handleToggleAtivo = async (c: any) => {
    if (c.ativo) {
      await api.patch(`/clientes/${c.id}/inativar`)
    } else {
      await api.patch(`/clientes/${c.id}/reativar`)
    }
    fetchClientes()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Clientes</h2>
        <button onClick={() => openModal()} style={btnPrimary}>+ Novo Cliente</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input placeholder="Buscar por nome..." value={busca} onChange={e => setBusca(e.target.value)}
          style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <input type="checkbox" checked={inativo} onChange={e => setInativo(e.target.checked)} />
          Mostrar inativos
        </label>
      </div>

      <div style={tableContainer}>
        {loading ? <p>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1976d2', color: '#fff' }}>
                {['Nome', 'CPF/CNPJ', 'Responsável', 'Telefone', 'Email', 'Ações'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={tdStyle}>{c.nome}</td>
                  <td style={tdStyle}>{c.cpfCnpj}</td>
                  <td style={tdStyle}>{c.responsavel}</td>
                  <td style={tdStyle}>{c.telefone}</td>
                  <td style={tdStyle}>{c.email}</td>
                  <td style={{ ...tdStyle, display: 'flex', gap: 6 }}>
                    <button onClick={() => openModal(c)} style={btnEdit}>Editar</button>
                    <button onClick={() => handleToggleAtivo(c)} style={c.ativo ? btnDanger : btnSuccess}>
                      {c.ativo ? 'Inativar' : 'Reativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {campos.map(c => (
                <div key={c.key}>
                  <label style={labelStyle}>{c.label}{c.required && ' *'}</label>
                  <input
                    type={c.type || 'text'}
                    value={form[c.key] || ''}
                    onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
            {erro && <p style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{erro}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={btnSecondary}>Cancelar</button>
              <button onClick={handleSave} style={btnPrimary}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Estilos
const btnPrimary: React.CSSProperties = { background: '#1976d2', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }
const btnSecondary: React.CSSProperties = { background: '#eee', color: '#333', border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 14 }
const btnEdit: React.CSSProperties = { background: '#1976d2', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }
const btnDanger: React.CSSProperties = { background: '#e53935', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }
const btnSuccess: React.CSSProperties = { background: '#43a047', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }
const tableContainer: React.CSSProperties = { background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', overflow: 'auto' }
const thStyle: React.CSSProperties = { padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: 13 }
const tdStyle: React.CSSProperties = { padding: '10px 14px', fontSize: 13, borderBottom: '1px solid #f0f0f0' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13, boxSizing: 'border-box' }
const labelStyle: React.CSSProperties = { fontSize: 12, color: '#555', display: 'block', marginBottom: 3 }
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: '#0005', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modal: React.CSSProperties = { background: '#fff', borderRadius: 12, padding: 32, minWidth: 560, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px #0004' }

export default Clientes
