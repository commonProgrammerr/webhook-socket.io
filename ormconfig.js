const path = require('path');
const { createConnection } = require('typeorm');

const isProd = process.env.NODE_ENV === 'prod';
const basePath = isProd ? './build/src' : './src';
const filesTypes = isProd ? '*.js' : '*.ts';
const DATABASE_URL = process.env.DATABASE_URL || 'localhost';

module.exports = {
  type: 'postgres',
  host: DATABASE_URL,
  port: 5432,
  database: isProd ? 'maint_app' : 'dev_maint_app',
  username: 'postgres',
  password: 'postgres',
  migrations: [path.resolve(basePath, 'database/migrations', filesTypes)],
  entities: [path.resolve(basePath, 'models', filesTypes)],
  cli: {
    migrationsDir: path.resolve(basePath, 'database/migrations'),
  },
};