import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

const include = {
  cliente: true,
  fornecedor: true,
  vendedor: true,
  categoria: true,
  produtos: { include: { produto: true } },
}

export async function getPedidos(req: AuthRequest, res: Response): Promise<void> {
  const { skip = 0, limit = 100, inativo } = req.query
  const pedidos = await prisma.pedido.findMany({
    where: { ativo: inativo === 'true' ? false : true },
    skip: Number(skip),
    take: Number(limit),
    include,
    orderBy: { createdAt: 'desc' },
  })
  res.json(pedidos)
}

// helper — aceita snake_case ou camelCase
function parsePedidoData(data: any) {
  return {
    numeroPedido:          data.numeroPedido          ?? data.numero_pedido,
    numeroOs:              data.numeroOs               ?? data.numero_os,
    dtPedido:              data.dtPedido               ?? data.dt_pedido,
    dtPrevistaEntrega:     data.dtPrevistaEntrega       ?? data.dt_prevista_entrega,
    clienteId:             data.clienteId              ?? data.cliente_id,
    fornecedorId:          data.fornecedorId           ?? data.fornecedor_id,
    vendedorId:            data.vendedorId             ?? data.vendedor_id,
    categoriaId:           data.categoriaId            ?? data.categoria_id,
    modalidadeFrete:       data.modalidadeFrete        ?? data.modalidade_frete,
    transportadora:        data.transportadora,
    ordemCompra:           data.ordemCompra            ?? data.ordem_compra,
    modalidadeFaturamento: data.modalidadeFaturamento  ?? data.modalidade_faturamento,
    formaPagamento:        data.formaPagamento         ?? data.forma_pagamento,
    condicaoPagamento:     data.condicaoPagamento      ?? data.condicao_pagamento,
    entregue:              data.entregue,
    ativo:                 data.ativo,
  }
}

function parseProdutoItem(p: any) {
  return {
    produtoId:    Number(p.produtoId    ?? p.produto_id),
    quantidade:   Number(p.quantidade),
    valorUnit:    Number(p.valorUnit    ?? p.valor_unit),
    valorTotal:   Number(p.valorTotal   ?? p.valor_total),
    unidadeMedida: p.unidadeMedida      ?? p.unidade_medida,
    descricao:    p.descricao,
  }
}

export async function createPedido(req: AuthRequest, res: Response): Promise<void> {
  const { produtos, ...rawData } = req.body
  const data = parsePedidoData(rawData)

  const existePedido = await prisma.pedido.findUnique({ where: { numeroPedido: data.numeroPedido } })
  if (existePedido) {
    res.status(409).json({ detail: 'Já existe um pedido com esse número.' })
    return
  }

  if (data.numeroOs) {
    const existeOs = await prisma.pedido.findUnique({ where: { numeroOs: data.numeroOs } })
    if (existeOs) {
      res.status(409).json({ detail: 'Já existe um pedido com esse número de OS.' })
      return
    }
  }

  const pedido = await prisma.pedido.create({
    data: {
      numeroPedido:          data.numeroPedido,
      numeroOs:              data.numeroOs,
      dtPedido:              data.dtPedido ? new Date(data.dtPedido) : new Date(),
      dtPrevistaEntrega:     data.dtPrevistaEntrega ? new Date(data.dtPrevistaEntrega) : null,
      clienteId:             data.clienteId    ? Number(data.clienteId)    : undefined,
      fornecedorId:          data.fornecedorId ? Number(data.fornecedorId) : undefined,
      vendedorId:            data.vendedorId   ? Number(data.vendedorId)   : undefined,
      categoriaId:           data.categoriaId  ? Number(data.categoriaId)  : undefined,
      modalidadeFrete:       data.modalidadeFrete,
      transportadora:        data.transportadora,
      ordemCompra:           data.ordemCompra,
      modalidadeFaturamento: data.modalidadeFaturamento,
      formaPagamento:        data.formaPagamento,
      condicaoPagamento:     data.condicaoPagamento,
      produtos: {
        create: (produtos || []).map(parseProdutoItem),
      },
    },
    include,
  })
  res.status(201).json(pedido)
}

export async function updatePedido(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const { produtos, ...rawData } = req.body
  const data = parsePedidoData(rawData)

  const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) } })
  if (!pedido) {
    res.status(404).json({ detail: 'Pedido não encontrado' })
    return
  }

  if (produtos !== undefined) {
    await prisma.pedidoProduto.deleteMany({ where: { pedidoId: Number(id) } })
  }

  const updated = await prisma.pedido.update({
    where: { id: Number(id) },
    data: {
      numeroPedido:          data.numeroPedido,
      numeroOs:              data.numeroOs,
      dtPedido:              data.dtPedido          ? new Date(data.dtPedido)          : undefined,
      dtPrevistaEntrega:     data.dtPrevistaEntrega  ? new Date(data.dtPrevistaEntrega)  : undefined,
      clienteId:             data.clienteId    != null ? Number(data.clienteId)    : undefined,
      fornecedorId:          data.fornecedorId != null ? Number(data.fornecedorId) : undefined,
      vendedorId:            data.vendedorId   != null ? Number(data.vendedorId)   : undefined,
      categoriaId:           data.categoriaId  != null ? Number(data.categoriaId)  : undefined,
      entregue:              data.entregue,
      ativo:                 data.ativo,
      modalidadeFrete:       data.modalidadeFrete,
      transportadora:        data.transportadora,
      ordemCompra:           data.ordemCompra,
      modalidadeFaturamento: data.modalidadeFaturamento,
      formaPagamento:        data.formaPagamento,
      condicaoPagamento:     data.condicaoPagamento,
      ...(produtos !== undefined ? {
        produtos: { create: produtos.map(parseProdutoItem) },
      } : {}),
    },
    include,
  })
  res.json(updated)
}

export async function marcarEntregue(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) } })
  if (!pedido) {
    res.status(404).json({ detail: 'Pedido não encontrado' })
    return
  }
  await prisma.pedido.update({
    where: { id: Number(id) },
    data: { entregue: true, dtEntrega: new Date() },
  })
  res.json({ ok: true })
}

export async function inativarPedido(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const p = await prisma.pedido.update({ where: { id: Number(id) }, data: { ativo: false }, include })
  res.json(p)
}

export async function reativarPedido(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const p = await prisma.pedido.update({ where: { id: Number(id) }, data: { ativo: true }, include })
  res.json(p)
}

export async function getStatus(req: AuthRequest, res: Response): Promise<void> {
  const hoje = new Date()
  const [emAndamento, atrasados, total, entregues] = await Promise.all([
    prisma.pedido.count({ where: { dtPrevistaEntrega: { gt: hoje }, entregue: false, ativo: true } }),
    prisma.pedido.count({ where: { dtPrevistaEntrega: { lt: hoje }, entregue: false, ativo: true } }),
    prisma.pedido.count({ where: { ativo: true } }),
    prisma.pedido.count({ where: { entregue: true } }),
  ])
  res.json({ em_andamento: emAndamento, atrasados, total, entregues_no_prazo: entregues })
}
