interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
  use_env_variable?: string;
}

// @ts-ignore
const config: Record<string, DbConfig> = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Flamur@!!1',
    database: process.env.DB_NAME || 'knio-project',
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

module.exports = config;
