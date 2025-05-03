import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDb } from '../database/models'; // Adjust path if needed
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';

dotenv.config();

interface AdminAttributes {
  id: string;
  facilityName?: string;
  facilityAddress?: string;
  zipCode?: string;
  country: string;
  city: string;
  email: string;
  password: string;
  waitingTime: number;
  createdAt: Date;
  updatedAt: Date;
  peopleInQueue?: number;
}

export const authenticateAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb(); // Wait for db to initialize
    const { email, password, facilityName } = req.body;
    console.log('Available models in authenticateAdmin:', Object.keys(db)); // Debug
    const admin = await db.Admin.findAll({ where: { email } });

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

export const getOneAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    console.log('Available models in getOneAdmin:', Object.keys(db));

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Admin ID is required',
      });
      return;
    }

    const admin = await db.Admin.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!admin) {
      res.status(404).json({
        status: 'error',
        message: 'Admin not found',
      });
      return;
    }

    res.json({
      status: 'ok',
      data: {
        id: admin.id,
        facilityName: admin.facilityName,
        facilityAddress: admin.facilityAddress,
        zipCode: admin.zipCode,
        country: admin.country,
        city: admin.city,
        email: admin.email,
        waitingTime: admin.waitingTime,
        peopleInQueue: admin.peopleInQueue,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
    return;
  } catch (err) {
    console.error('Error in getOneAdmin:', err);
    next(err);
  }
};

export const getAllAdmins: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    console.log('Available models in getAllAdmins:', Object.keys(db));

    const admins = await db.Admin.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json({
      status: 'ok',
      data: admins.map((admin: AdminAttributes) => ({
        id: admin.id,
        facilityName: admin.facilityName,
        facilityAddress: admin.facilityAddress,
        zipCode: admin.zipCode,
        country: admin.country,
        city: admin.city,
        email: admin.email,
        waitingTime: admin.waitingTime,
        peopleInQueue: admin.peopleInQueue,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      })),
    });
    return;
  } catch (err) {
    console.error('Error in getAllAdmins:', err);
    next(err);
  }
};

export const deleteAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    console.log('Available models in deleteAdmin:', Object.keys(db));

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Admin ID is required',
      });
      return;
    }

    const admin = await db.Admin.findByPk(id);
    if (!admin) {
      res.status(404).json({
        status: 'error',
        message: 'Admin not found',
      });
      return;
    }

    await admin.destroy();
    res.json({
      status: 'ok',
      message: 'Admin deleted successfully',
    });
    return;
  } catch (err) {
    console.error('Error in deleteAdmin:', err);
    next(err);
  }
};

export const updateAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const {
      facilityName,
      facilityAddress,
      zipCode,
      country,
      city,
      email,
      password,
      waitingTime,
      peopleInQueue,
    } = req.body;
    console.log('Available models in updateAdmin:', Object.keys(db));

    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Admin ID is required',
      });
      return;
    }

    const admin = await db.Admin.findByPk(id);
    if (!admin) {
      res.status(404).json({
        status: 'error',
        message: 'Admin not found',
      });
      return;
    }

    const updateData: Partial<AdminAttributes> = {};
    if (facilityName !== undefined) updateData.facilityName = facilityName;
    if (facilityAddress !== undefined)
      updateData.facilityAddress = facilityAddress;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = await encrypt(password);
    if (waitingTime !== undefined) updateData.waitingTime = waitingTime;
    if (peopleInQueue !== undefined) updateData.peopleInQueue = peopleInQueue;

    console.log('Updating admin with data:', updateData);
    await admin.update(updateData);

    res.json({
      status: 'ok',
      data: {
        id: admin.id,
        facilityName: admin.facilityName,
        facilityAddress: admin.facilityAddress,
        zipCode: admin.zipCode,
        country: admin.country,
        city: admin.city,
        email: admin.email,
        waitingTime: admin.waitingTime,
        peopleInQueue: admin.peopleInQueue,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
    return;
  } catch (err) {
    console.error('Error in updateAdmin:', err);
    next(err);
  }
};
