import { Router } from 'express';

import * as ticketController from '../controllers/ticket.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ticketController.list);
router.post('/', requireRole('client'), ticketController.create);
router.get('/:id', ticketController.get);
router.patch('/:id/status', requireRole('agent'), ticketController.updateStatus);
router.patch('/:id/assign', requireRole('agent'), ticketController.assign);
router.post('/:id/comments', ticketController.comment);

export default router;
