// user.route.ts
import { Router } from 'express';
import { authenticateUser, registerUser } from '../controllers/user.controller';

const router = Router();

// ✓ Use POST so that req.body is populated
router.post('/login', authenticateUser);
router.post('/register', registerUser);

export default router;
