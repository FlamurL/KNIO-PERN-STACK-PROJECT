// connection.ts
import { Sequelize } from 'sequelize';
const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize: Sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(
    process.env[dbConfig.use_env_variable] as string,
    dbConfig
  );
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: dbConfig.dialect as 'postgres',
      port: dbConfig.port,
    }
  );
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    console.log(dbConfig.database, dbConfig.username, dbConfig.password);
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

export default sequelize;
