import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getFornecedores, createFornecedor, updateFornecedor, inativarFornecedor, reativarFornecedor } from '../controllers/fornecedores.controller'

const router = Router()
router.use(authMiddleware)
router.get('/', getFornecedores)
router.post('/', createFornecedor)
router.put('/:id', updateFornecedor)
router.patch('/:id/inativar', inativarFornecedor)
router.patch('/:id/reativar', reativarFornecedor)

export default router
