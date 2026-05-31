import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getClientes, createCliente, updateCliente, inativarCliente, reativarCliente } from '../controllers/clientes.controller'

const router = Router()
router.use(authMiddleware)
router.get('/', getClientes)
router.post('/', createCliente)
router.put('/:id', updateCliente)
router.patch('/:id/inativar', inativarCliente)
router.patch('/:id/reativar', reativarCliente)

export default router
