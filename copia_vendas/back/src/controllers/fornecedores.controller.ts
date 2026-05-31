import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function getFornecedores(req: AuthRequest, res: Response): Promise<void> {
  const { skip = 0, limit = 100, inativo } = req.query
  const fornecedores = await prisma.fornecedor.findMany({
    where: { ativo: inativo === 'true' ? false : true },
    skip: Number(skip),
    take: Number(limit),
    orderBy: { razaoSocial: 'asc' },
  })
  res.json(fornecedores)
}

export async function createFornecedor(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body
  const razaoSocial = data.razaoSocial ?? data.razao_social
  const existe = await prisma.fornecedor.findUnique({ where: { cnpj: data.cnpj } })
  if (existe) {
    res.status(400).json({ detail: `CNPJ já cadastrado: ${data.cnpj}` })
    return
  }
  const fornecedor = await prisma.fornecedor.create({
    data: {
      cnpj: data.cnpj,
      razaoSocial,
      responsavel: data.responsavel,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
    },
  })
  res.status(201).json(fornecedor)
}

export async function updateFornecedor(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const data = req.body
  const existe = await prisma.fornecedor.findUnique({ where: { id: Number(id) } })
  if (!existe) {
    res.status(404).json({ detail: 'Fornecedor não encontrado' })
    return
  }
  const updated = await prisma.fornecedor.update({
    where: { id: Number(id) },
    data: {
      cnpj: data.cnpj,
      razaoSocial: data.razaoSocial ?? data.razao_social,
      responsavel: data.responsavel,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
      ativo: data.ativo,
    },
  })
  res.json(updated)
}

export async function inativarFornecedor(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const f = await prisma.fornecedor.update({ where: { id: Number(id) }, data: { ativo: false } })
  res.json(f)
}

export async function reativarFornecedor(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const f = await prisma.fornecedor.update({ where: { id: Number(id) }, data: { ativo: true } })
  res.json(f)
}
