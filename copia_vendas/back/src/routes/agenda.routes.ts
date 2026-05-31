import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getAgenda, createAgendamento, updateAgendamento, marcarRealizado, getProximos, deleteAgendamento } from '../controllers/agenda.controller'

const router = Router()
router.use(authMiddleware)
router.get('/proximos', getProximos)
router.get('/', getAgenda)
router.post('/', createAgendamento)
router.put('/:id', updateAgendamento)
router.post('/:id/realizado', marcarRealizado)
router.delete('/:id', deleteAgendamento)

export default router
