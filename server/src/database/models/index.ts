// models/index.ts
'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);

const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
// @ts-ignore
const dbConfig = config[env]; // Pick the right environment config

const db: any = {};

let sequelize: any;
if (dbConfig.use_env_variable) {
  // @ts-ignore
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  // @ts-ignore
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
    );
  })
  .forEach(async (file: any) => {
    const modelModule = await import(path.join(__dirname, file));

    // Check if the model has an initModel function
    if (
      modelModule &&
      modelModule.default &&
      typeof modelModule.default.initModel === 'function'
    ) {
      const model = modelModule.default.initModel(sequelize);
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db };
