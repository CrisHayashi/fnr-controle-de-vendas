import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar vendedor admin
  const senhaHash = await bcrypt.hash('admin123', 10)

  const vendedor = await prisma.vendedor.upsert({
    where: { email: 'admin@vendas.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@vendas.com',
      senhaHash,
      isAdmin: true,
      ativo: true,
    },
  })

  // Criar usuário vinculado ao vendedor
  await prisma.usuario.upsert({
    where: { email: 'admin@vendas.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@vendas.com',
      senhaHash,
      ativo: true,
      vendedorId: vendedor.id,
    },
  })

  // Criar categorias
  const categorias = ['Eletrônicos', 'Móveis', 'Serviços', 'Informática', 'Outros']
  for (const nome of categorias) {
    await prisma.categoria.upsert({
      where: { nome },
      update: {},
      create: { nome, ativo: true },
    })
  }

  console.log('✅ Seed concluído!')
  console.log('👤 Login: admin@vendas.com | Senha: admin123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
