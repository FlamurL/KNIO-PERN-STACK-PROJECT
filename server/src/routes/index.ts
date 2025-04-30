import express from 'express';
import userRoutes from './user.route';

const router = express.Router();

export const getIndex = async (req: express.Request, res: express.Response) => {
  res.json({ message: 'Hello World!' });
}

router.get('/', getIndex);

router.use('/users', userRoutes);

export default router;
