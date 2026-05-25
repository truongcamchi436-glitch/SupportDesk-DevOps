import { Router } from 'express';

import * as ticketController from '../controllers/ticket.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ticketController.list);
router.post('/', requireRole('client'), ticketController.create);

router.patch('/:id/assign', requireRole('agent'), ticketController.assign);
router.patch('/:id/unassign', requireRole('agent'), ticketController.unassign);
router.patch('/:id/close', requireRole('agent'), ticketController.close);
router.patch('/:id/cancel', requireRole('client'), ticketController.cancel);
router.post('/:id/comments', ticketController.comment);

router.get('/:id', ticketController.get);

export default router;
