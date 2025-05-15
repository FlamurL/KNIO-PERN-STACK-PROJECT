// user.route.ts
import { Router } from 'express';
import {
  authenticateUser,
  registerUser,
  getUserById,
} from '../controllers/user.controller';

const router = Router();

// ✓ Use POST so that req.body is populated
router.post('/login', authenticateUser);
router.post('/register', registerUser);
router.get('/:userId', getUserById);

export default router;
