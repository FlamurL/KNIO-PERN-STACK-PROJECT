import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDb } from '../database/models'; // Adjust path if needed
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';

dotenv.config();

export const authenticateAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb(); // Wait for db to initialize
    const { email, password, facilityName } = req.body;
    console.log('Available models in authenticateAdmin:', Object.keys(db)); // Debug
    const admin = await db.Admin.findAll({ where: { email, facilityName } });

    if (!admin.length) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const user = admin[0];
    const match = await validateUser(user.password, password);
    if (!match) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    res.json({
      email: user.email,
      facilityName: user.facilityName,
      token,
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const registerAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb(); // Wait for db to initialize
    const {
      facilityName,
      facilityAddress,
      zipCode,
      country,
      city,
      email,
      password,
      waitingTime,
    } = req.body;
    const hash = await encrypt(password);
    console.log('Available models in registerAdmin:', Object.keys(db)); // Debug
    console.log(1111, db.Admin); // Debug
    await db.Admin.create({
      facilityName,
      facilityAddress,
      zipCode,
      country,
      city,
      email,
      password: hash,
      waitingTime,
      peopleInQueue: 0,
    });

    res.status(201).json({ status: 'ok' });
    return;
  } catch (err) {
    next(err);
  }
};
