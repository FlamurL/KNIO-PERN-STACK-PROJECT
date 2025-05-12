import express from 'express';
import {
  getQueue,
  joinQueue,
  leaveQueue,
  leaveQueueFromOwner,
  authenticateAdminInQueue,
} from '../controllers/admin.controller';

const router = express.Router();

router.get('/:facilityId', getQueue);
router.post('/:facilityId/join', joinQueue);
router.post('/:facilityId/leave', leaveQueue);
router.post('/leave/:facilityId', leaveQueueFromOwner);
router.post('/auth', authenticateAdminInQueue);

export default router;
