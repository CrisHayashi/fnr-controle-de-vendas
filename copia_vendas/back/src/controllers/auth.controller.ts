import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma'

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ detail: 'Email e senha são obrigatórios' })
    return
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: username } })

  if (!usuario) {
    res.status(401).json({ detail: 'Email ou senha incorretos' })
    return
  }

  const senhaValida = await bcrypt.compare(password, usuario.senhaHash)
  if (!senhaValida) {
    res.status(401).json({ detail: 'Email ou senha incorretos' })
    return
  }

  if (!usuario.ativo) {
    res.status(403).json({ detail: 'Usuário inativo' })
    return
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || '30m') as `${number}${'s' | 'm' | 'h' | 'd'}`
  const token = jwt.sign(
    { sub: usuario.email, id: usuario.id },
    process.env.JWT_SECRET || 'secret',
    { expiresIn }
  )

  res.json({ access_token: token, token_type: 'bearer' })
}
