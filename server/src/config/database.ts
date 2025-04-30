import Sequelize from 'sequelize';
import dotenv from 'dotenv-safe';
// @ts-ignore
import config from './config';

const env = process.env.NODE_ENV || 'development'; // Default to development
const dbConfig = config[env];

async function authenticateDB() {
  // @ts-ignore
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      logging: false,
    },
  );

}

export default authenticateDB;
