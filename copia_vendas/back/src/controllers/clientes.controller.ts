import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function getClientes(req: AuthRequest, res: Response): Promise<void> {
  const { skip = 0, limit = 100, inativo, nome } = req.query

  const clientes = await prisma.cliente.findMany({
    where: {
      ativo: inativo === 'true' ? false : true,
      ...(nome ? { nome: { contains: String(nome) } } : {}),
    },
    skip: Number(skip),
    take: Number(limit),
    orderBy: { nome: 'asc' },
  })
  res.json(clientes)
}

export async function createCliente(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body
  const cpfCnpj = data.cpfCnpj ?? data.cpf_cnpj
  const iEst    = data.iEst    ?? data.i_est
  const iMuni   = data.iMuni   ?? data.i_muni

  const existeCpf = await prisma.cliente.findUnique({ where: { cpfCnpj } })
  if (existeCpf) {
    res.status(400).json({ detail: `CPF/CNPJ já cadastrado: ${cpfCnpj}` })
    return
  }

  if (data.email) {
    const existeEmail = await prisma.cliente.findUnique({ where: { email: data.email } })
    if (existeEmail) {
      res.status(400).json({ detail: `E-mail já cadastrado: ${data.email}` })
      return
    }
  }

  const cliente = await prisma.cliente.create({
    data: {
      nome: data.nome,
      cpfCnpj,
      iEst,
      iMuni,
      responsavel: data.responsavel,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
    },
  })
  res.status(201).json(cliente)
}

export async function updateCliente(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const data = req.body
  const cpfCnpj = data.cpfCnpj ?? data.cpf_cnpj
  const iEst    = data.iEst    ?? data.i_est
  const iMuni   = data.iMuni   ?? data.i_muni

  const cliente = await prisma.cliente.findUnique({ where: { id: Number(id) } })
  if (!cliente) {
    res.status(404).json({ detail: 'Cliente não encontrado' })
    return
  }

  if (cpfCnpj) {
    const existeCpf = await prisma.cliente.findFirst({
      where: { cpfCnpj, NOT: { id: Number(id) } },
    })
    if (existeCpf) {
      res.status(400).json({ detail: `CPF/CNPJ já cadastrado: ${cpfCnpj}` })
      return
    }
  }

  if (data.email) {
    const existeEmail = await prisma.cliente.findFirst({
      where: { email: data.email, NOT: { id: Number(id) } },
    })
    if (existeEmail) {
      res.status(400).json({ detail: `E-mail já cadastrado: ${data.email}` })
      return
    }
  }

  const updated = await prisma.cliente.update({
    where: { id: Number(id) },
    data: {
      nome: data.nome,
      cpfCnpj,
      iEst,
      iMuni,
      responsavel: data.responsavel,
      telefone: data.telefone,
      email: data.email,
      endereco: data.endereco,
      ativo: data.ativo,
    },
  })
  res.json(updated)
}

export async function inativarCliente(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const cliente = await prisma.cliente.update({
    where: { id: Number(id) },
    data: { ativo: false },
  })
  res.json(cliente)
}

export async function reativarCliente(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const cliente = await prisma.cliente.update({
    where: { id: Number(id) },
    data: { ativo: true },
  })
  res.json(cliente)
}
