import React, { useEffect, useState } from 'react'
import api from '../../services/api'

const Pedidos: React.FC = () => {
  const [lista, setLista] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [vendedores, setVendedores] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({ produtos: [] })
  const [erro, setErro] = useState('')
  const [inativo, setInativo] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    const [ped, c, f, v, cat, prod] = await Promise.all([
      api.get(`/pedidos?inativo=${inativo}`),
      api.get('/clientes'), api.get('/fornecedores'),
      api.get('/vendedores'), api.get('/categorias'), api.get('/produtos'),
    ])
    setLista(ped.data); setClientes(c.data); setFornecedores(f.data)
    setVendedores(v.data); setCategorias(cat.data); setProdutos(prod.data)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [inativo])

  const openModal = (item?: any) => {
    setEditing(item || null)
    setForm(item ? {
      ...item,
      clienteId: item.cliente?.id, fornecedorId: item.fornecedor?.id,
      vendedorId: item.vendedor?.id, categoriaId: item.categoria?.id,
      produtos: item.produtos?.map((p: any) => ({ produtoId: p.produto?.id, quantidade: p.quantidade, valorUnit: p.valorUnit, valorTotal: p.valorTotal, unidadeMedida: p.unidadeMedida, descricao: p.descricao })) || []
    } : { produtos: [] })
    setErro(''); setShowModal(true)
  }

  const addProduto = () => setForm({ ...form, produtos: [...form.produtos, { produtoId: '', quantidade: 1, valorUnit: 0, valorTotal: 0, unidadeMedida: '', descricao: '' }] })
  const removeProduto = (i: number) => setForm({ ...form, produtos: form.produtos.filter((_: any, idx: number) => idx !== i) })
  const updateProduto = (i: number, field: string, value: any) => {
    const prods = [...form.produtos]
    prods[i] = { ...prods[i], [field]: value }
    if (field === 'quantidade' || field === 'valorUnit') {
      prods[i].valorTotal = (Number(prods[i].quantidade) * Number(prods[i].valorUnit)).toFixed(2)
    }
    setForm({ ...form, produtos: prods })
  }

  const handleSave = async () => {
    setErro('')
    const payload = {
      numero_pedido: form.numeroPedido, numero_os: form.numeroOs,
      dt_pedido: form.dtPedido, dt_prevista_entrega: form.dtPrevistaEntrega,
      cliente_id: Number(form.clienteId), fornecedor_id: Number(form.fornecedorId),
      vendedor_id: Number(form.vendedorId), categoria_id: Number(form.categoriaId),
      modalidade_frete: form.modalidadeFrete, transportadora: form.transportadora,
      ordem_compra: form.ordemCompra, modalidade_faturamento: form.modalidadeFaturamento,
      forma_pagamento: form.formaPagamento, condicao_pagamento: form.condicaoPagamento,
      produtos: form.produtos.map((p: any) => ({ produto_id: Number(p.produtoId), quantidade: Number(p.quantidade), valor_unit: Number(p.valorUnit), valor_total: Number(p.valorTotal), unidade_medida: p.unidadeMedida, descricao: p.descricao }))
    }
    try {
      if (editing) await api.put(`/pedidos/${editing.id}`, payload)
      else await api.post('/pedidos', payload)
      setShowModal(false); fetchAll()
    } catch (e: any) { setErro(e.response?.data?.detail || 'Erro ao salvar') }
  }

  const marcarEntregue = async (id: number) => { await api.post(`/pedidos/${id}/entregue`); fetchAll() }
  const toggleAtivo = async (item: any) => {
    if (item.ativo) await api.patch(`/pedidos/${item.id}/inativar`)
    else await api.patch(`/pedidos/${item.id}/reativar`)
    fetchAll()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Pedidos</h2>
        <button onClick={() => openModal()} style={btnPrimary}>+ Novo Pedido</button>
      </div>
      <label style={{ fontSize: 14, marginBottom: 12, display: 'block' }}>
        <input type="checkbox" checked={inativo} onChange={e => setInativo(e.target.checked)} /> Mostrar inativos
      </label>
      <div style={tableContainer}>
        {loading ? <p style={{ padding: 16 }}>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#1976d2', color: '#fff' }}>
              {['Nº Pedido', 'OS', 'Cliente', 'Vendedor', 'Data', 'Entrega Prev.', 'Entregue', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr></thead>
            <tbody>{lista.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                <td style={tdStyle}>{item.numeroPedido}</td>
                <td style={tdStyle}>{item.numeroOs}</td>
                <td style={tdStyle}>{item.cliente?.nome}</td>
                <td style={tdStyle}>{item.vendedor?.nome}</td>
                <td style={tdStyle}>{item.dtPedido ? new Date(item.dtPedido).toLocaleDateString('pt-BR') : '-'}</td>
                <td style={tdStyle}>{item.dtPrevistaEntrega ? new Date(item.dtPrevistaEntrega).toLocaleDateString('pt-BR') : '-'}</td>
                <td style={tdStyle}><span style={{ color: item.entregue ? '#43a047' : '#f57c00', fontWeight: 600 }}>{item.entregue ? '✅ Sim' : '⏳ Não'}</span></td>
                <td style={{ ...tdStyle, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <button onClick={() => openModal(item)} style={btnEdit}>Editar</button>
                  {!item.entregue && <button onClick={() => marcarEntregue(item.id)} style={{ ...btnSuccess, fontSize: 11 }}>Entregar</button>}
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
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Editar Pedido' : 'Novo Pedido'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { key: 'numeroPedido', label: 'Nº Pedido *' }, { key: 'numeroOs', label: 'Nº OS' },
                { key: 'dtPedido', label: 'Data Pedido', type: 'date' }, { key: 'dtPrevistaEntrega', label: 'Entrega Prevista', type: 'date' },
                { key: 'modalidadeFrete', label: 'Modalidade Frete' }, { key: 'transportadora', label: 'Transportadora' },
                { key: 'ordemCompra', label: 'Ordem de Compra' }, { key: 'modalidadeFaturamento', label: 'Modalidade Faturamento' },
                { key: 'formaPagamento', label: 'Forma Pagamento' }, { key: 'condicaoPagamento', label: 'Condição Pagamento' },
              ].map(c => (
                <div key={c.key}>
                  <label style={labelStyle}>{c.label}</label>
                  <input type={c.type || 'text'} value={c.type === 'date' ? (form[c.key] ? form[c.key].substring(0, 10) : '') : form[c.key] || ''} onChange={e => setForm({ ...form, [c.key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              {[{ key: 'clienteId', label: 'Cliente', opts: clientes, display: 'nome' }, { key: 'fornecedorId', label: 'Fornecedor', opts: fornecedores, display: 'razaoSocial' }, { key: 'vendedorId', label: 'Vendedor', opts: vendedores, display: 'nome' }, { key: 'categoriaId', label: 'Categoria', opts: categorias, display: 'nome' }].map(s => (
                <div key={s.key}>
                  <label style={labelStyle}>{s.label}</label>
                  <select value={form[s.key] || ''} onChange={e => setForm({ ...form, [s.key]: e.target.value })} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {s.opts.map((o: any) => <option key={o.id} value={o.id}>{o[s.display]}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>Produtos</strong>
                <button onClick={addProduto} style={{ ...btnPrimary, padding: '4px 10px', fontSize: 12 }}>+ Adicionar</button>
              </div>
              {form.produtos.map((p: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
                  <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Produto</label>
                    <select value={p.produtoId || ''} onChange={e => updateProduto(i, 'produtoId', e.target.value)} style={inputStyle}>
                      <option value="">Selecione...</option>
                      {produtos.map((prod: any) => <option key={prod.id} value={prod.id}>{prod.tipo}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Qtd</label>
                    <input type="number" value={p.quantidade} onChange={e => updateProduto(i, 'quantidade', e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Vl Unit</label>
                    <input type="number" value={p.valorUnit} onChange={e => updateProduto(i, 'valorUnit', e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Total</label>
                    <input type="number" value={p.valorTotal} readOnly style={{ ...inputStyle, background: '#f5f5f5' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Unidade</label>
                    <input value={p.unidadeMedida || ''} onChange={e => updateProduto(i, 'unidadeMedida', e.target.value)} style={inputStyle} />
                  </div>
                  <button onClick={() => removeProduto(i)} style={{ ...btnDanger, alignSelf: 'flex-end', marginBottom: 1 }}>✕</button>
                </div>
              ))}
            </div>

            {erro && <p style={{ color: 'red', fontSize: 13 }}>{erro}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
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
const modalStyle: React.CSSProperties = { background: '#fff', borderRadius: 12, padding: 32, width: '90vw', maxWidth: 900, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px #0004' }

export default Pedidos
