import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

const basename = path.basename(__filename);
const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db: any = {};

// Initialize Sequelize instance
let sequelize: Sequelize;
try {
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
      dbConfig
    );
  }
} catch (err) {
  console.error('Failed to initialize Sequelize:', err);
  process.exit(1);
}

// Load model files
const modelFiles = fs.readdirSync(__dirname).filter((file: string) => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    (file.slice(-3) === '.ts' || file.slice(-3) === '.js')
  );
});

// Load models
const loadModels = async () => {
  for (const file of modelFiles) {
    console.log('Processing file:', file);
    try {
      const modelModule = await import(path.join(__dirname, file));
      console.log('Imported module for', file, modelModule);
      if (
        modelModule &&
        modelModule.default &&
        typeof modelModule.default.initModel === 'function'
      ) {
        const model = modelModule.default.initModel(sequelize);
        console.log('Initialized model:', model.name);
        db[model.name] = model; // Register model in db object
      } else {
        console.log('Skipping file, no valid initModel:', file);
      }
    } catch (err) {
      console.error(`Error loading model from ${file}:`, err);
    }
  }

  // Run associations if any
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  console.log('Available models:', Object.keys(db));
};

// Initialize models and assign sequelize
const initialize = async () => {
  await loadModels();
  db.sequelize = sequelize; // Assign sequelize after models are loaded
  db.Sequelize = Sequelize;
  console.log('Sequelize assigned to db.sequelize');
  return db;
};

// Export a promise that resolves to the db object
export const getDb = async () => {
  await initialize();
  return db;
};
