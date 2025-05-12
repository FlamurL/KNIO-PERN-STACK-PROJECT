import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv-safe/config';
import { getDb } from '../database/models';
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  peopleInQueue: number;
  createdAt: Date;
  updatedAt: Date;
}

// AUTHENTICATE
export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { email, password } = req.body;
    console.log('User login attempt:', { email });

    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
      return;
    }

    const user = await db.Users.findOne({ where: { email } });
    console.log('User found:', user ? user.get({ plain: true }) : null);

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email',
      });
      return;
    }

    const match = await validateUser(password, user.passwordHash);
    console.log('Password match:', match);

    if (!match) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid password',
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      status: 'ok',
      name: user.name || user.email,
      email: user.email,
      token,
      role: 'user',
    });
  } catch (err) {
    console.error('Error in authenticateUser:', err);
    next(err);
  }
};

// REGISTER
export const registerUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const db = await getDb();
    const { name, email, password, isActive } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required',
      });
      return;
    }

    const existingUser = await db.Users.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(409)
        .json({ status: 'error', message: 'Email already exists' });
      return;
    }

    const passwordHash = await encrypt(password);
    await db.Users.create({
      name,
      email,
      passwordHash,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      peopleInQueue: 0,
    });

    res.status(201).json({ status: 'ok' });
  } catch (err) {
    console.error('Error in registerUser:', err);
    next(err);
  }
};
