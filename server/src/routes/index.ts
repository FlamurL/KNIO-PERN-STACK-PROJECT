import express from 'express';
import userRoutes from './user.route';
import adminRoutes from './admin.route';

const router = express.Router();

export const getIndex = async (req: express.Request, res: express.Response) => {
  res.json({ message: 'Hello World!' });
};

router.get('/', getIndex);

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export default router;
