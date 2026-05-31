import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const Categorias: React.FC = () => {
  const [lista, setLista] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [erro, setErro] = useState('')

  const fetch = async () => { setLoading(true); const res = await api.get('/categorias'); setLista(res.data); setLoading(false) }

  useEffect(() => { fetch() }, [])

  const openModal = (item?: any) => { setEditing(item || null); setForm(item || {}); setErro(''); setShowModal(true) }

  const handleSave = async () => {
    setErro('')
    try {
      if (editing) await api.put(`/categorias/${editing.id}`, form)
      else await api.post('/categorias', form)
      setShowModal(false); fetch()
    } catch (e: any) { setErro(e.response?.data?.detail || 'Erro ao salvar') }
  }

  const toggleAtivo = async (item: any) => {
    if (item.ativo) await api.patch(`/categorias/${item.id}/inativar`)
    else await api.patch(`/categorias/${item.id}/reativar`)
    fetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Categorias</h2>
        <button onClick={() => openModal()} style={btnPrimary}>+ Nova Categoria</button>
      </div>
      <div style={tableContainer}>
        {loading ? <p style={{ padding: 16 }}>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1976d2', color: '#fff' }}>
              {['Nome', 'Descrição', 'Status', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>{lista.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={tdStyle}>{item.nome}</td>
                <td style={tdStyle}>{item.descricao}</td>
                <td style={tdStyle}><span style={{ color: item.ativo ? '#43a047' : '#e53935', fontWeight: 600 }}>{item.ativo ? 'Ativo' : 'Inativo'}</span></td>
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
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 400, boxShadow: '0 8px 32px #0004' }}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Editar Categoria' : 'Nova Categoria'}</h3>
            {[{ key: 'nome', label: 'Nome *' }, { key: 'descricao', label: 'Descrição' }].map(c => (
              <div key={c.key} style={{ marginBottom: 12 }}>
                <label style={labelStyle}>{c.label}</label>
                <input value={form[c.key] || ''} onChange={e => setForm({ ...form, [c.key]: e.target.value })} style={inputStyle} />
              </div>
            ))}
            {erro && <p style={{ color: 'red', fontSize: 13 }}>{erro}</p>}
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

export default Categorias
