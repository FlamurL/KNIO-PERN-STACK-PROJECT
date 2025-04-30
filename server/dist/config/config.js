"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        username: '',
        password: '',
        database: '',
        host: '',
        port: 0,
    },
};
exports.default = config;
