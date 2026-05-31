import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getVendedores, createVendedor, updateVendedor, inativarVendedor, reativarVendedor } from '../controllers/vendedores.controller'

const router = Router()
router.use(authMiddleware)
router.get('/', getVendedores)
router.post('/', createVendedor)
router.put('/:id', updateVendedor)
router.patch('/:id/inativar', inativarVendedor)
router.patch('/:id/reativar', reativarVendedor)

export default router
