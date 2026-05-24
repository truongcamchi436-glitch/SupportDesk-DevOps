import { Router } from 'express';

import authRoutes from './auth.route.js';
import ticketRoutes from './ticket.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);

export default router;
