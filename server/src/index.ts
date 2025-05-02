import express from 'express';
import { getDb } from '@models/index'; // Adjust path if needed
import routes from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import errorMiddleware from './middleware/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);

async function startServer() {
  try {
    const db = await getDb(); // Wait for db to initialize
    console.log('Available models:', Object.keys(db)); // Debug: Check if Admin is present
    if (!db.sequelize) {
      throw new Error('Sequelize instance is not initialized');
    }
    await db.sequelize.sync({ force: false }); // Sync database
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
