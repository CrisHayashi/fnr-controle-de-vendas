import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import authRoutes from './routes/auth.routes'
import clientesRoutes from './routes/clientes.routes'
import fornecedoresRoutes from './routes/fornecedores.routes'
import pedidosRoutes from './routes/pedidos.routes'
import produtosRoutes from './routes/produtos.routes'
import categoriasRoutes from './routes/categorias.routes'
import vendedoresRoutes from './routes/vendedores.routes'
import agendaRoutes from './routes/agenda.routes'

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Bloqueio de versão de demonstração
app.use((req, res, next) => {
  const expiracao = new Date('2026-07-10T23:59:59')
  if (new Date() > expiracao) {
    res.status(403).json({
      detail: 'Esta versão de demonstração expirou em 10/07/2026. Entre em contato com o desenvolvedor.',
    })
    return
  }
  next()
})

// Rotas
app.use('/auth', authRoutes)
app.use('/clientes', clientesRoutes)
app.use('/fornecedores', fornecedoresRoutes)
app.use('/pedidos', pedidosRoutes)
app.use('/produtos', produtosRoutes)
app.use('/categorias', categoriasRoutes)
app.use('/vendedores', vendedoresRoutes)
app.use('/agenda', agendaRoutes)

// Rota pública de cadastro de novo usuário
app.post('/cadastro', async (req, res) => {
  try {
    const prisma = (await import('./config/prisma')).default
    const bcrypt = (await import('bcryptjs')).default
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      res.status(400).json({ detail: 'Nome, email e senha são obrigatórios.' })
      return
    }

    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) {
      res.status(409).json({ detail: 'Este e-mail já está cadastrado.' })
      return
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    // Verifica se é o primeiro usuário (será admin)
    const totalUsuarios = await prisma.usuario.count()
    const isAdmin = totalUsuarios === 0

    const vendedor = await prisma.vendedor.upsert({
      where: { email },
      update: {},
      create: { nome, email, senhaHash, isAdmin, ativo: true },
    })

    await prisma.usuario.create({
      data: { nome, email, senhaHash, ativo: true, vendedorId: vendedor.id },
    })

    // Criar categorias padrão se for o primeiro cadastro
    if (isAdmin) {
      const categorias = ['Eletrônicos', 'Móveis', 'Serviços', 'Informática', 'Outros']
      for (const c of categorias) {
        await prisma.categoria.upsert({ where: { nome: c }, update: {}, create: { nome: c, ativo: true } })
      }
    }

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' })
  } catch {
    res.status(500).json({ detail: 'Erro ao realizar cadastro.' })
  }
})

app.get('/', (_req, res) => {
  res.json({ message: 'Bem-vindo à API de Controle de Vendas (Node.js)' })
})

export default app
