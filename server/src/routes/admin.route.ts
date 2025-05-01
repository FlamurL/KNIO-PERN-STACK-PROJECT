import express from 'express';
import {
  authenticateAdmin,
  registerAdmin,
} from '../controllers/admin.controller';

const router = express.Router();
router.post('/login', authenticateAdmin);
router.post('/register', registerAdmin);

export default router;
