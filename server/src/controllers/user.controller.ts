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
}

export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { email, password } = req.body;
    console.log('Available models in authenticateUser:', Object.keys(db));

    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
      return;
    }

    const user = await db.Users.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const match = await validateUser(user.passwordHash, password);
    if (!match) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    res.json({
      name: user.name,
      email: user.email,
      token,
    });
    return;
  } catch (err) {
    console.error('Error in authenticateUser:', err);
    next(err);
  }
};

export const registerUser: RequestHandler = async (req, res, next) => {
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
      res.status(409).json({
        status: 'error',
        message: 'Email already exists',
      });
      return;
    }

    const hash = await encrypt(password);
    const userData: Partial<UserAttributes> = {
      name,
      email,
      passwordHash: hash,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      peopleInQueue: 0,
    };
    console.log('Creating user with data:', userData);
    await db.Users.create(userData);
    res.status(201).json({ status: 'ok' });
    return;
  } catch (err) {
    console.error('Error in registerUser:', err);
    next(err);
  }
};
