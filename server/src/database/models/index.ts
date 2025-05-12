import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import sequelize from './connection'; // Import the connected Sequelize instance
import { Admin } from './admin'; // Import the Admin class
import { Users } from './users'; // Import the Users class

const basename = path.basename(__filename);
const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db: any = {};

// Initialize models
const loadModels = async () => {
  const models: any = {};

  // Initialize Admin model
  models.Admin = Admin.initModel(sequelize);
  console.log('Initialized model:', models.Admin.name);

  // Initialize Users model
  models.Users = Users.initModel(sequelize);
  console.log('Initialized model:', models.Users.name);

  // Set up associations
  if (models.Users.associate) {
    models.Users.associate(models);
  }
  if (models.Admin.associate) {
    models.Admin.associate(models);
  }

  console.log('Available models:', Object.keys(models));
  return models;
};

// Initialize models and assign sequelize
const initialize = async () => {
  const models = await loadModels();
  db.Admin = models.Admin;
  db.Users = models.Users;
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  console.log('Sequelize assigned to db.sequelize');
  return db;
};

// Export a promise that resolves to the db object
export const getDb = async () => {
  await initialize();
  return db;
};

export default db;
