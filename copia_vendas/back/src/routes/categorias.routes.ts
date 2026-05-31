import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getCategorias, createCategoria, updateCategoria, inativarCategoria, reativarCategoria } from '../controllers/categorias.controller'

const router = Router()
router.use(authMiddleware)
router.get('/', getCategorias)
router.post('/', createCategoria)
router.put('/:id', updateCategoria)
router.patch('/:id/inativar', inativarCategoria)
router.patch('/:id/reativar', reativarCategoria)

export default router
