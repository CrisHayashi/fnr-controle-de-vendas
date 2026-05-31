import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const Produtos: React.FC = () => {
  const [lista, setLista] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [erro, setErro] = useState('')
  const [inativo, setInativo] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const [res, cats] = await Promise.all([api.get(`/produtos?inativo=${inativo}`), api.get('/categorias')])
    setLista(res.data); setCategorias(cats.data); setLoading(false)
  }

  useEffect(() => { fetch() }, [inativo])

  const openModal = (item?: any) => { setEditing(item || null); setForm(item ? { ...item, categoriaId: item.categoria?.id } : {}); setErro(''); setShowModal(true) }

  const handleSave = async () => {
    setErro('')
    const payload = { tipo: form.tipo, quantidade: Number(form.quantidade), valorUnit: Number(form.valorUnit), valorTotal: Number(form.valorTotal), unidadeMedida: form.unidadeMedida, categoriaId: Number(form.categoriaId) }
    try {
      if (editing) await api.put(`/produtos/${editing.id}`, payload)
      else await api.post('/produtos', payload)
      setShowModal(false); fetch()
    } catch (e: any) { setErro(e.response?.data?.detail || 'Erro ao salvar') }
  }

  const toggleAtivo = async (item: any) => {
    if (item.ativo) await api.patch(`/produtos/${item.id}/inativar`)
    else await api.patch(`/produtos/${item.id}/reativar`)
    fetch()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Produtos</h2>
        <button onClick={() => openModal()} style={btnPrimary}>+ Novo Produto</button>
      </div>
      <label style={{ fontSize: 14, marginBottom: 12, display: 'block' }}>
        <input type="checkbox" checked={inativo} onChange={e => setInativo(e.target.checked)} /> Mostrar inativos
      </label>
      <div style={tableContainer}>
        {loading ? <p style={{ padding: 16 }}>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1976d2', color: '#fff' }}>
              {['Tipo', 'Qtd', 'Valor Unit.', 'Valor Total', 'Unidade', 'Categoria', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>{lista.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={tdStyle}>{item.tipo}</td>
                <td style={tdStyle}>{item.quantidade}</td>
                <td style={tdStyle}>R$ {Number(item.valorUnit).toFixed(2)}</td>
                <td style={tdStyle}>R$ {Number(item.valorTotal).toFixed(2)}</td>
                <td style={tdStyle}>{item.unidadeMedida}</td>
                <td style={tdStyle}>{item.categoria?.nome}</td>
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
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 500, boxShadow: '0 8px 32px #0004' }}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Editar Produto' : 'Novo Produto'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ key: 'tipo', label: 'Tipo *' }, { key: 'quantidade', label: 'Quantidade *', type: 'number' }, { key: 'valorUnit', label: 'Valor Unit. *', type: 'number' }, { key: 'valorTotal', label: 'Valor Total *', type: 'number' }, { key: 'unidadeMedida', label: 'Unidade Medida' }].map(c => (
                <div key={c.key}>
                  <label style={labelStyle}>{c.label}</label>
                  <input type={c.type || 'text'} value={form[c.key] || ''} onChange={e => setForm({ ...form, [c.key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Categoria</label>
                <select value={form.categoriaId || ''} onChange={e => setForm({ ...form, categoriaId: e.target.value })} style={inputStyle}>
                  <option value="">Selecione...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
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

export default Produtos
