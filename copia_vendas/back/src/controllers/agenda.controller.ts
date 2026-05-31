import { Response } from 'express'
import prisma from '../config/prisma'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function getAgenda(req: AuthRequest, res: Response): Promise<void> {
  const { skip = 0, limit = 100 } = req.query
  const agendamentos = await prisma.agenda.findMany({
    skip: Number(skip),
    take: Number(limit),
    include: { cliente: true, vendedor: true },
    orderBy: { dataAgendamento: 'asc' },
  })
  res.json(agendamentos)
}

export async function createAgendamento(req: AuthRequest, res: Response): Promise<void> {
  const data = req.body
  const dataAgendamento    = data.dataAgendamento    ?? data.data_agendamento
  const repetirMensalmente = data.repetirMensalmente ?? data.repetir_mensalmente ?? false
  const clienteId          = data.clienteId          ?? data.cliente_id
  const vendedorId         = data.vendedorId         ?? data.vendedor_id

  const agendamento = await prisma.agenda.create({
    data: {
      dataAgendamento: new Date(dataAgendamento),
      observacao: data.observacao,
      repetirMensalmente,
      clienteId:  clienteId  ? Number(clienteId)  : undefined,
      vendedorId: vendedorId ? Number(vendedorId) : undefined,
    },
    include: { cliente: true, vendedor: true },
  })
  res.status(201).json(agendamento)
}

export async function updateAgendamento(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const data = req.body
  const existe = await prisma.agenda.findUnique({ where: { id: Number(id) } })
  if (!existe) {
    res.status(404).json({ detail: 'Agendamento não encontrado' })
    return
  }
  const dataAgendamento    = data.dataAgendamento    ?? data.data_agendamento
  const repetirMensalmente = data.repetirMensalmente ?? data.repetir_mensalmente
  const clienteId          = data.clienteId          ?? data.cliente_id
  const vendedorId         = data.vendedorId         ?? data.vendedor_id

  const updated = await prisma.agenda.update({
    where: { id: Number(id) },
    data: {
      dataAgendamento:    dataAgendamento    ? new Date(dataAgendamento) : undefined,
      observacao:         data.observacao,
      realizado:          data.realizado,
      repetirMensalmente: repetirMensalmente,
      clienteId:          clienteId  != null ? Number(clienteId)  : undefined,
      vendedorId:         vendedorId != null ? Number(vendedorId) : undefined,
    },
    include: { cliente: true, vendedor: true },
  })
  res.json(updated)
}

export async function marcarRealizado(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  const agendamento = await prisma.agenda.findUnique({ where: { id: Number(id) } })
  if (!agendamento) {
    res.status(404).json({ detail: 'Agendamento não encontrado' })
    return
  }

  await prisma.agenda.update({ where: { id: Number(id) }, data: { realizado: true } })

  // Repetição mensal
  if (agendamento.repetirMensalmente) {
    const novaData = new Date(agendamento.dataAgendamento)
    novaData.setDate(novaData.getDate() + 30)
    await prisma.agenda.create({
      data: {
        dataAgendamento: novaData,
        observacao: agendamento.observacao,
        repetirMensalmente: true,
        clienteId: agendamento.clienteId,
        vendedorId: agendamento.vendedorId,
      },
    })
  }
  res.json({ ok: true })
}

export async function getProximos(req: AuthRequest, res: Response): Promise<void> {
  const hoje = new Date()
  const proximaSemana = new Date()
  proximaSemana.setDate(hoje.getDate() + 7)

  const agendamentos = await prisma.agenda.findMany({
    where: {
      dataAgendamento: { gte: hoje, lte: proximaSemana },
      realizado: false,
    },
    include: { cliente: true, vendedor: true },
    orderBy: { dataAgendamento: 'asc' },
  })
  res.json(agendamentos)
}

export async function deleteAgendamento(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params
  await prisma.agenda.delete({ where: { id: Number(id) } })
  res.json({ ok: true })
}
