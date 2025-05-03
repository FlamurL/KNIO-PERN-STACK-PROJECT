import express from 'express';
import {
  authenticateAdmin,
  registerAdmin,
  getOneAdmin,
  getAllAdmins,
  deleteAdmin,
  updateAdmin,
} from '../controllers/admin.controller';

const router = express.Router();
router.post('/login', authenticateAdmin);
router.post('/register', registerAdmin);
router.get('/', getAllAdmins);
router.get('/:id', getOneAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
export default router;
