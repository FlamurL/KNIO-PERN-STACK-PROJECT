'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const sequelizeConnection = config.use_env_variable
    ? new sequelize_1.Sequelize(process.env[config.use_env_variable], config)
    : new sequelize_1.Sequelize(config.database, config.username, config.password, config);
exports.default = sequelizeConnection;
