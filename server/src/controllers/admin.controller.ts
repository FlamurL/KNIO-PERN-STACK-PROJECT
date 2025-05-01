import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../database/models';
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';

dotenv.config();

export const authenticateAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, facilityName } = req.body;
    const admin = await db.admin.findAll({ where: { email, facilityName } });

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
      name: user.name,
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
    console.log(1111, db.Admin);
    await db.Admin.create({
      facilityName,
      facilityAddress,
      zipCode,
      country,
      city,
      email,
      password,
      waitingTime,
      peopleInQueue: 0,
    });

    res.status(201).json({ status: 'ok' });
    return;
  } catch (err) {
    next(err);
  }
};
