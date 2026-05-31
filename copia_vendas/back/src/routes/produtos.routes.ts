import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getProdutos, createProduto, updateProduto, inativarProduto, reativarProduto } from '../controllers/produtos.controller'

const router = Router()
router.use(authMiddleware)
router.get('/', getProdutos)
router.post('/', createProduto)
router.put('/:id', updateProduto)
router.patch('/:id/inativar', inativarProduto)
router.patch('/:id/reativar', reativarProduto)

export default router
