// src/index.ts
import express from 'express';
import { db } from '@models/index'; // Adjust path if needed (e.g., @models/index)
import routes from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import errorMiddleware from './middleware/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Use PORT, not DB_PORT, and match your new port

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);

async function startServer() {
  try {
    console.log('Available models:', Object.keys(db)); // Debug: Check if Admin is present
    await db.sequelize.sync(); // Sync database
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
