import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const Agenda: React.FC = () => {
  const [lista, setLista] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [vendedores, setVendedores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [erro, setErro] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const [ag, c, v] = await Promise.all([api.get('/agenda'), api.get('/clientes'), api.get('/vendedores')])
    setLista(ag.data); setClientes(c.data); setVendedores(v.data); setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const openModal = (item?: any) => {
    setEditing(item || null)
    setForm(item ? { ...item, clienteId: item.cliente?.id, vendedorId: item.vendedor?.id } : {})
    setErro(''); setShowModal(true)
  }

  const handleSave = async () => {
    setErro('')
    const payload = {
      data_agendamento: form.dataAgendamento, observacao: form.observacao,
      cliente_id: Number(form.clienteId), vendedor_id: Number(form.vendedorId),
      repetir_mensalmente: form.repetirMensalmente || false,
    }
    try {
      if (editing) await api.put(`/agenda/${editing.id}`, payload)
      else await api.post('/agenda', payload)
      setShowModal(false); fetchAll()
    } catch (e: any) { setErro(e.response?.data?.detail || 'Erro ao salvar') }
  }

  const marcarRealizado = async (id: number) => { await api.post(`/agenda/${id}/realizado`); fetchAll() }
  const excluir = async (id: number) => { if (confirm('Excluir agendamento?')) { await api.delete(`/agenda/${id}`); fetchAll() } }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Agenda</h2>
        <button onClick={() => openModal()} style={btnPrimary}>+ Novo Agendamento</button>
      </div>
      <div style={tableContainer}>
        {loading ? <p style={{ padding: 16 }}>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1976d2', color: '#fff' }}>
              {['Data', 'Cliente', 'Vendedor', 'Observação', 'Repetir', 'Realizado', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>{lista.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={tdStyle}>{item.dataAgendamento ? new Date(item.dataAgendamento).toLocaleString('pt-BR') : '-'}</td>
                <td style={tdStyle}>{item.cliente?.nome}</td>
                <td style={tdStyle}>{item.vendedor?.nome}</td>
                <td style={tdStyle}>{item.observacao}</td>
                <td style={tdStyle}>{item.repetirMensalmente ? '✅' : '—'}</td>
                <td style={tdStyle}><span style={{ color: item.realizado ? '#43a047' : '#f57c00', fontWeight: 600 }}>{item.realizado ? 'Sim' : 'Não'}</span></td>
                <td style={{ ...tdStyle, display: 'flex', gap: 4 }}>
                  <button onClick={() => openModal(item)} style={btnEdit}>Editar</button>
                  {!item.realizado && <button onClick={() => marcarRealizado(item.id)} style={btnSuccess}>✓ Realizar</button>}
                  <button onClick={() => excluir(item.id)} style={btnDanger}>✕</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={overlayStyle}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 500, boxShadow: '0 8px 32px #0004' }}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Data/Hora *</label>
                <input type="datetime-local" value={form.dataAgendamento ? form.dataAgendamento.substring(0, 16) : ''} onChange={e => setForm({ ...form, dataAgendamento: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Cliente</label>
                <select value={form.clienteId || ''} onChange={e => setForm({ ...form, clienteId: e.target.value })} style={inputStyle}>
                  <option value="">Selecione...</option>
                  {clientes.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Vendedor</label>
                <select value={form.vendedorId || ''} onChange={e => setForm({ ...form, vendedorId: e.target.value })} style={inputStyle}>
                  <option value="">Selecione...</option>
                  {vendedores.map((v: any) => <option key={v.id} value={v.id}>{v.nome}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Observação</label>
                <textarea value={form.observacao || ''} onChange={e => setForm({ ...form, observacao: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={!!form.repetirMensalmente} onChange={e => setForm({ ...form, repetirMensalmente: e.target.checked })} />
                  Repetir mensalmente
                </label>
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

export default Agenda
