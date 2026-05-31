import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function getProdutos(req: AuthRequest, res: Response): Promise<void> {
  const { skip = 0, limit = 100, inativo } = req.query
  const produtos = await prisma.produto.findMany({
    where: { ativo: inativo === 'true' ? false : true },
    skip: Number(skip),
    take: Number(limit),
    include: { categoria: true },
    orderBy: { tipo: 'asc' },
  })
  res.json(produtos)
}

export async function createProduto(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body
  const produto = await prisma.produto.create({
    data: {
      tipo: data.tipo,
      quantidade: Number(data.quantidade),
      valorUnit: Number(data.valorUnit ?? data.valor_unit),
      valorTotal: Number(data.valorTotal ?? data.valor_total),
      unidadeMedida: data.unidadeMedida ?? data.unidade_medida,
      categoriaId: data.categoriaId ? Number(data.categoriaId) : (data.categoria_id ? Number(data.categoria_id) : undefined),
    },
    include: { categoria: true },
  })
  res.status(201).json(produto)
}

export async function updateProduto(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const data = req.body
  const existe = await prisma.produto.findUnique({ where: { id: Number(id) } })
  if (!existe) {
    res.status(404).json({ detail: 'Produto não encontrado' })
    return
  }
  const updated = await prisma.produto.update({
    where: { id: Number(id) },
    data: {
      tipo: data.tipo,
      quantidade: data.quantidade !== undefined ? Number(data.quantidade) : undefined,
      valorUnit: (data.valorUnit ?? data.valor_unit) !== undefined ? Number(data.valorUnit ?? data.valor_unit) : undefined,
      valorTotal: (data.valorTotal ?? data.valor_total) !== undefined ? Number(data.valorTotal ?? data.valor_total) : undefined,
      unidadeMedida: data.unidadeMedida ?? data.unidade_medida,
      categoriaId: (data.categoriaId ?? data.categoria_id) !== undefined ? Number(data.categoriaId ?? data.categoria_id) : undefined,
      ativo: data.ativo,
    },
    include: { categoria: true },
  })
  res.json(updated)
}

export async function inativarProduto(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const p = await prisma.produto.update({ where: { id: Number(id) }, data: { ativo: false }, include: { categoria: true } })
  res.json(p)
}

export async function reativarProduto(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const p = await prisma.produto.update({ where: { id: Number(id) }, data: { ativo: true }, include: { categoria: true } })
  res.json(p)
}
