import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getPedidos, createPedido, updatePedido, marcarEntregue, inativarPedido, reativarPedido, getStatus } from '../controllers/pedidos.controller'

const router = Router()
router.use(authMiddleware)
router.get('/status', getStatus)
router.get('/', getPedidos)
router.post('/', createPedido)
router.put('/:id', updatePedido)
router.post('/:id/entregue', marcarEntregue)
router.patch('/:id/inativar', inativarPedido)
router.patch('/:id/reativar', reativarPedido)

export default router
