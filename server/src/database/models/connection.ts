import { Sequelize } from 'sequelize';
const config = require("../../config/config");
import * as process from 'node:process';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
console.log("DB CONFIG", dbConfig);

let sequelize: Sequelize;

if (dbConfig.use_env_variable) {
  // Use only the DATABASE_URL env variable for the connection string
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable] as string);
} else {
  // Pass the individual parts of the dbConfig for the Sequelize constructor
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect as 'postgres',  // You can specify the dialect type explicitly here if you want
    port: dbConfig.port,
  });
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit the process if the connection fails
  });

export default sequelize;
