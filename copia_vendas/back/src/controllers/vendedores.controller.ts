import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function getVendedores(req: AuthRequest, res: Response): Promise<void> {
  const { skip = 0, limit = 100, inativo } = req.query
  const vendedores = await prisma.vendedor.findMany({
    where: { ativo: inativo === 'true' ? false : true },
    skip: Number(skip),
    take: Number(limit),
    orderBy: { nome: 'asc' },
  })
  res.json(vendedores)
}

export async function createVendedor(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body
  const existe = await prisma.vendedor.findUnique({ where: { email: data.email } })
  if (existe) {
    res.status(409).json({ detail: 'E-mail já cadastrado' })
    return
  }
  const vendedor = await prisma.vendedor.create({
    data: {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      descricao: data.descricao,
    },
  })
  res.status(201).json(vendedor)
}

export async function updateVendedor(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const data = req.body
  const existe = await prisma.vendedor.findUnique({ where: { id: Number(id) } })
  if (!existe) {
    res.status(404).json({ detail: 'Vendedor não encontrado' })
    return
  }
  const updated = await prisma.vendedor.update({
    where: { id: Number(id) },
    data: {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      descricao: data.descricao,
      ativo: data.ativo,
    },
  })
  res.json(updated)
}

export async function inativarVendedor(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const v = await prisma.vendedor.update({ where: { id: Number(id) }, data: { ativo: false } })
  res.json(v)
}

export async function reativarVendedor(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const v = await prisma.vendedor.update({ where: { id: Number(id) }, data: { ativo: true } })
  res.json(v)
}
