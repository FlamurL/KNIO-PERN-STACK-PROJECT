import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getDb } from '../database/models'; // Adjust path if needed
import { encrypt, validateUser } from '../encrypt/encrypt.string.compare';
import { Transaction } from 'sequelize'; // Import Transaction type
import { isValidUUID } from '../encrypt/validation';
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

interface UserAttributes {
  id: string;
  name?: string;
  email?: string;
  passwordHash: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  peopleInQueue?: number;
  currentQueueId?: string;
}
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

interface AuthenticatedAdminRequest extends Request {
  admin?: { id: string };
}
// Middleware to authenticate user via JWT
export const authenticateUser: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication token required',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const db = await getDb();
    const user = await db.Users.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    req.user = { id: user.id }; // Attach user ID to request
    next();
  } catch (err) {
    console.error('Error in authenticateUser:', err);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};
export const authenticateAdminInQueue: RequestHandler = async (
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(
      'authenticateAdminInQueue: Token received:',
      token ? 'Present' : 'Missing'
    );

    if (!token) {
      res.status(401).json({ status: 'error', message: 'No token provided' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      res
        .status(500)
        .json({ status: 'error', message: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      email?: string;
      role?: string;
    };
    console.log('authenticateAdminInQueue: Decoded token:', decoded);

    if (decoded.role !== 'admin') {
      res.status(403).json({
        status: 'error',
        message: 'Unauthorized: Admin role required',
      });
      return;
    }

    const db = await getDb();
    const admin = await db.Admin.findByPk(decoded.id);
    console.log(
      'authenticateAdminInQueue: Admin found:',
      admin ? admin.id : 'Not found'
    );

    if (!admin) {
      res.status(404).json({ status: 'error', message: 'Admin not found' });
      return;
    }

    req.admin = { id: decoded.id };
    next();
  } catch (err: any) {
    console.error(
      'authenticateAdminInQueue: Error verifying token:',
      err.message
    );
    res
      .status(401)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};
export const authenticateAdmin: RequestHandler = async (req, res, next) => {
  try {
    const db = await getDb();
    const { email, password, facilityName } = req.body;
    console.log('Login attempt:', { email, facilityName });

    if (!email || !password || !facilityName) {
      res.status(400).json({
        status: 'error',
        message: 'Email, password, and facility name are required',
      });
      return;
    }

    const admin = await db.Admin.findOne({ where: { email, facilityName } });
    console.log('Admin found:', admin ? admin.get({ plain: true }) : null);

    if (!admin) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or facility name',
      });
      return;
    }

    const match = await validateUser(password, admin.password);
    console.log('Password match:', match);

    if (!match) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid password',
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      res
        .status(500)
        .json({ status: 'error', message: 'Server configuration error' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated token:', token);

    res.json({
      status: 'ok',
      token,
      facilityName: admin.facilityName,
      facilityId: admin.id,
      name: admin.facilityName || 'Admin',
      role: 'admin',
    });
  } catch (err: any) {
    console.error('Error in authenticateAdmin:', err.message);
    res.status(500).json({ status: 'error', message: 'Server error' });
    next(err);
  }
};

export const leaveQueue: RequestHandler[] = [
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const db = await getDb();
      const { facilityId } = req.params;
      const userId = req.user!.id;
      console.log('leaveQueue: Attempt:', { facilityId, userId });

      if (!facilityId) {
        res.status(400).json({
          status: 'error',
          message: 'Facility ID is required',
        });
        return;
      }

      await db.sequelize.transaction(async (t: Transaction) => {
        const user = await db.Users.findByPk(userId, { transaction: t });
        console.log('leaveQueue: User found:', user ? user.id : 'Not found');
        if (!user) {
          res.status(404).json({
            status: 'error',
            message: 'User not found',
          });
          return;
        }

        if (user.currentQueueId !== facilityId) {
          res.status(400).json({
            status: 'error',
            message: 'User is not in this queue',
          });
          return;
        }

        const admin = await db.Admin.findByPk(facilityId, { transaction: t });
        console.log('leaveQueue: Admin found:', admin ? admin.id : 'Not found');
        if (!admin) {
          res.status(404).json({
            status: 'error',
            message: 'Facility not found',
          });
          return;
        }

        await user.update({ currentQueueId: null }, { transaction: t });
        await admin.update(
          { peopleInQueue: Math.max((admin.peopleInQueue || 1) - 1, 0) },
          { transaction: t }
        );

        const users = await db.Users.findAll({
          where: {
            currentQueueId: facilityId,
            isActive: true,
          },
          attributes: ['id', 'name'],
          transaction: t,
        });

        const queue = users.map((user: UserAttributes) => ({
          id: user.id,
          name: user.name || 'Unknown',
          status: 'waiting' as const,
        }));

        res.json({
          status: 'ok',
          message: 'Left queue successfully',
          data: {
            queue,
            peopleInQueue: admin.peopleInQueue,
          },
        });
      });
    } catch (err: any) {
      console.error('leaveQueue: Error:', err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
      next(err);
    }
  },
];

export const leaveQueueFromOwner: RequestHandler[] = [
  authenticateAdminInQueue,
  async (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    try {
      const db = await getDb();
      const { facilityId } = req.params;
      const { userId } = req.body;
      console.log('leaveQueueFromOwner: Attempt:', { facilityId, userId });

      if (!facilityId || !userId) {
        console.log('leaveQueueFromOwner: Missing required fields', {
          facilityId,
          userId,
        });
        res.status(400).json({
          status: 'error',
          message: 'Facility ID and user ID are required',
        });
        return;
      }

      if (!isValidUUID(userId)) {
        console.log('leaveQueueFromOwner: Invalid userId format:', userId);
        res.status(400).json({
          status: 'error',
          message: 'Invalid user ID format',
        });
        return;
      }

      await db.sequelize.transaction(async (t: Transaction) => {
        const admin = await db.Admin.findByPk(facilityId, { transaction: t });
        console.log(
          'leaveQueueFromOwner: Admin found:',
          admin ? admin.id : 'Not found'
        );
        if (!admin || admin.id !== req.admin!.id) {
          res.status(403).json({
            status: 'error',
            message: 'Unauthorized: You do not own this facility',
          });
          return;
        }

        const user = await db.Users.findByPk(userId, { transaction: t });
        console.log(
          'leaveQueueFromOwner: User found:',
          user ? user.id : 'Not found'
        );
        if (!user) {
          res.status(404).json({
            status: 'error',
            message: 'User not found',
          });
          return;
        }

        console.log(
          'leaveQueueFromOwner: User currentQueueId:',
          user.currentQueueId
        );
        if (user.currentQueueId !== facilityId) {
          res.status(400).json({
            status: 'error',
            message: 'User is not in this queue',
          });
          return;
        }

        await user.update({ currentQueueId: null }, { transaction: t });
        await admin.update(
          { peopleInQueue: Math.max((admin.peopleInQueue || 1) - 1, 0) },
          { transaction: t }
        );

        const users = await db.Users.findAll({
          where: {
            currentQueueId: facilityId,
            isActive: true,
          },
          attributes: ['id', 'name'],
          transaction: t,
        });

        const queue = users.map((user: UserAttributes) => ({
          id: user.id,
          name: user.name || 'Unknown',
          status: 'waiting' as const,
        }));

        res.json({
          status: 'ok',
          message: 'User removed from queue successfully',
          data: {
            queue,
            peopleInQueue: admin.peopleInQueue,
          },
        });
      });
    } catch (err: any) {
      console.error('leaveQueueFromOwner: Error:', err.message);
      res.status(500).json({ status: 'error', message: 'Server error' });
      next(err);
    }
  },
];

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const registerAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = await getDb();
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
    console.log('Available models in registerAdmin:', Object.keys(db));
    console.log(1111, db.Admin);
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
  } catch (err) {
    next(err);
  }
};

export const getOneAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (err) {
    console.error('Error in getOneAdmin:', err);
    next(err);
  }
};

export const getAllAdmins: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = await getDb();
    console.log('Available models in getAllAdmins:', Object.keys(db));
    console.log('Admin Model:', db.Admin);

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
  } catch (err) {
    console.error('Error in getAllAdmins:', err);
    next(err);
  }
};

export const deleteAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (err) {
    console.error('Error in deleteAdmin:', err);
    next(err);
  }
};

export const updateAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (err) {
    console.error('Error in updateAdmin:', err);
    next(err);
  }
};

export const getQueue: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = await getDb();
    const { facilityId } = req.params;
    console.log('Available models in getQueue:', Object.keys(db));

    if (!facilityId) {
      res.status(400).json({
        status: 'error',
        message: 'Facility ID is required',
      });
      return;
    }

    const admin = await db.Admin.findByPk(facilityId);
    if (!admin) {
      res.status(404).json({
        status: 'error',
        message: 'Facility not found',
      });
      return;
    }

    const users = await db.Users.findAll({
      where: {
        currentQueueId: facilityId,
        isActive: true,
      },
      attributes: ['id', 'name'],
    });

    const queue = users.map((user: UserAttributes) => ({
      id: user.id,
      name: user.name || 'Unknown',
      status: 'waiting' as const,
    }));

    res.json({
      status: 'ok',
      data: {
        facilityId,
        queue,
        peopleInQueue: admin.peopleInQueue || queue.length,
      },
    });
  } catch (err) {
    console.error('Error in getQueue:', err);
    next(err);
  }
};

export const joinQueue: RequestHandler[] = [
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const db = await getDb();
      const { facilityId } = req.params;
      const userId = req.user!.id; // Safe because authenticateUser ensures req.user exists
      console.log('Available models in joinQueue:', Object.keys(db));

      if (!facilityId) {
        res.status(400).json({
          status: 'error',
          message: 'Facility ID is required',
        });
        return;
      }

      await db.sequelize.transaction(async (t: Transaction) => {
        const user = await db.Users.findByPk(userId, { transaction: t });
        if (!user) {
          res.status(404).json({
            status: 'error',
            message: 'User not found',
          });
          return;
        }

        if (user.currentQueueId && user.currentQueueId !== facilityId) {
          // Fetch the current queue's facilityName
          const currentFacility = await db.Admin.findByPk(user.currentQueueId, {
            attributes: ['facilityName'],
            transaction: t,
          });
          res.status(400).json({
            status: 'error',
            message: `User is already in another queue: ${
              currentFacility?.facilityName || 'Unknown Facility'
            }`,
            currentQueue: {
              facilityId: user.currentQueueId,
              facilityName: currentFacility?.facilityName || 'Unknown Facility',
            },
          });
          return;
        }

        if (user.currentQueueId === facilityId) {
          res.status(400).json({
            status: 'error',
            message: 'User is already in this queue',
          });
          return;
        }

        const admin = await db.Admin.findByPk(facilityId, { transaction: t });
        if (!admin) {
          res.status(404).json({
            status: 'error',
            message: 'Facility not found',
          });
          return;
        }

        await user.update({ currentQueueId: facilityId }, { transaction: t });
        await admin.update(
          { peopleInQueue: (admin.peopleInQueue || 0) + 1 },
          { transaction: t }
        );

        const users = await db.Users.findAll({
          where: {
            currentQueueId: facilityId,
            isActive: true,
          },
          attributes: ['id', 'name'],
          transaction: t,
        });

        const queue = users.map((user: UserAttributes) => ({
          id: user.id,
          name: user.name || 'Unknown',
          status: 'waiting' as const,
        }));

        res.json({
          status: 'ok',
          message: 'Joined queue successfully',
          data: {
            queue,
            peopleInQueue: admin.peopleInQueue,
          },
        });
      });
    } catch (err) {
      console.error('Error in joinQueue:', err);
      next(err);
    }
  },
];
