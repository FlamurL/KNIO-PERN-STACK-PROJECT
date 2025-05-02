import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDb } from '../database/models'; // Adjust path if needed
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';

dotenv.config();

export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb(); // Wait for db to initialize
    const { email, password } = req.body;
    console.log('Available models in authenticateUser:', Object.keys(db)); // Debug
    const users = await db.Users.findAll({ where: { email } });

    if (!users.length) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const user = users[0];
    const match = await validateUser(user.passwordHash, password); // Use passwordHash
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
    const db = await getDb(); // Wait for db to initialize
    const { name, email, password } = req.body;
    const hash = await encrypt(password);
    console.log('Available models in registerUser:', Object.keys(db)); // Debug
    console.log('db.Users:', db.Users); // Debug
    await db.Users.create({
      name,
      email,
      passwordHash: hash, // Use passwordHash to match model
      isActive: true,
      peopleInQueue: 0,
    });

    res.status(201).json({ status: 'ok' });
    return;
  } catch (err) {
    next(err);
  }
};
