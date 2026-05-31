import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const campos = [
  { key: 'cnpj', label: 'CNPJ', required: true },
  { key: 'razaoSocial', label: 'Razão Social', required: true },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'endereco', label: 'Endereço' },
]

const Fornecedores: React.FC = () => {
  const [lista, setLista] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [erro, setErro] = useState('')
  const [inativo, setInativo] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const res = await api.get(`/fornecedores?inativo=${inativo}`)
    setLista(res.data)
    setLoading(false)
  }

  useEffect(() => { fetch() }, [inativo])

  const openModal = (item?: any) => { setEditing(item || null); setForm(item || {}); setErro(''); setShowModal(true) }

  const handleSave = async () => {
    setErro('')
    try {
      if (editing) await api.put(`/fornecedores/${editing.id}`, form)
      else await api.post('/fornecedores', form)
      setShowModal(false); fetch()
    } catch (e: any) { setErro(e.response?.data?.detail || 'Erro ao salvar') }
  }

  const toggleAtivo = async (item: any) => {
    if (item.ativo) await api.patch(`/fornecedores/${item.id}/inativar`)
    else await api.patch(`/fornecedores/${item.id}/reativar`)
    fetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Fornecedores</h2>
        <button onClick={() => openModal()} style={btnPrimary}>+ Novo Fornecedor</button>
      </div>
      <label style={{ fontSize: 14, marginBottom: 12, display: 'block' }}>
        <input type="checkbox" checked={inativo} onChange={e => setInativo(e.target.checked)} /> Mostrar inativos
      </label>
      <div style={tableContainer}>
        {loading ? <p>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1976d2', color: '#fff' }}>
              {['CNPJ', 'Razão Social', 'Responsável', 'Telefone', 'Email', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>{lista.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={tdStyle}>{item.cnpj}</td>
                <td style={tdStyle}>{item.razaoSocial}</td>
                <td style={tdStyle}>{item.responsavel}</td>
                <td style={tdStyle}>{item.telefone}</td>
                <td style={tdStyle}>{item.email}</td>
                <td style={{ ...tdStyle, display: 'flex', gap: 6 }}>
                  <button onClick={() => openModal(item)} style={btnEdit}>Editar</button>
                  <button onClick={() => toggleAtivo(item)} style={item.ativo ? btnDanger : btnSuccess}>{item.ativo ? 'Inativar' : 'Reativar'}</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {campos.map(c => (
                <div key={c.key}>
                  <label style={labelStyle}>{c.label}{c.required && ' *'}</label>
                  <input type={c.type || 'text'} value={form[c.key] || ''} onChange={e => setForm({ ...form, [c.key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
            </div>
            {erro && <p style={{ color: 'red', fontSize: 13, marginTop: 8 }}>{erro}</p>}
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
const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: '#0005', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
const modalStyle: React.CSSProperties = { background: '#fff', borderRadius: 12, padding: 32, minWidth: 560, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px #0004' }

export default Fornecedores
