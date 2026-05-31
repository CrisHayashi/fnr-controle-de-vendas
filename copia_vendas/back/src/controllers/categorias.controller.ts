import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function getCategorias(req: AuthRequest, res: Response): Promise<void> {
  const { inativo } = req.query
  const categorias = await prisma.categoria.findMany({
    where: { ativo: inativo === 'true' ? false : true },
    orderBy: { nome: 'asc' },
  })
  res.json(categorias)
}

export async function createCategoria(req: AuthRequest, res: Response): Promise<void> {
  const { nome, descricao } = req.body
  const existe = await prisma.categoria.findUnique({ where: { nome } })
  if (existe) {
    res.status(400).json({ detail: 'Categoria já cadastrada' })
    return
  }
  const categoria = await prisma.categoria.create({ data: { nome, descricao } })
  res.status(201).json(categoria)
}

export async function updateCategoria(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const { nome, descricao, ativo } = req.body
  const updated = await prisma.categoria.update({
    where: { id: Number(id) },
    data: { nome, descricao, ativo },
  })
  res.json(updated)
}

export async function inativarCategoria(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const c = await prisma.categoria.update({ where: { id: Number(id) }, data: { ativo: false } })
  res.json(c)
}

export async function reativarCategoria(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const c = await prisma.categoria.update({ where: { id: Number(id) }, data: { ativo: true } })
  res.json(c)
}
