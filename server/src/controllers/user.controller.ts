import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDb } from '../database/models';
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';

dotenv.config();

export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { email, password } = req.body;
    console.log('Available models in authenticateUser:', Object.keys(db));
    const users = await db.Users.findAll({ where: { email } });

    if (!users.length) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const user = users[0];
    const match = await validateUser(user.passwordHash, password);
    if (!match) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    res.json({
      name: user.name,
      email: user.email,
      token,
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { name, email, password, isActive } = req.body;
    const hash = await encrypt(password);
    console.log('Available models in registerUser:', Object.keys(db));
    console.log('db.Users:', db.Users);
    const userData = {
      name,
      email,
      passwordHash: hash,
      isActive: isActive ?? true, // Use provided isActive or default to true
      peopleInQueue: 0,
    };
    console.log('Creating user with data:', userData); // Debug
    await db.Users.create(userData);
    res.status(201).json({ status: 'ok' });
    return;
  } catch (err) {
    console.error('Error in registerUser:', err); // Log full error
    next(err);
  }
};
