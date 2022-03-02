const path = require('path');
// const { createConnection } = require('typeorm');

const isProd = process.env.NODE_ENV === 'prod';
const basePath = isProd ? './build/src' : './src';
const filesTypes = isProd ? '*.js' : '*.ts';
// const DATABASE_URL = process.env.DATABASE_URL || 'localhost';
// const url$ = !!process.env.DATABASE_URL;

const baseConfig = {
  // type: 'postgres',
  // database: isProd ? 'maint_app' : 'dev_maint_app',
  migrations: [path.resolve(basePath, 'database/migrations', filesTypes)],
  entities: [path.resolve(basePath, 'models', filesTypes)],
  cli: {
    migrationsDir: path.resolve(basePath, 'database/migrations'),
  },
};
module.exports = {
  type: 'sqlite',
  database: path.resolve(basePath, 'database/database.sqlite'),
  migrations: [path.resolve(basePath, 'database/migrations', filesTypes)],
  entities: [path.resolve(basePath, 'models', filesTypes)],
  cli: {
    migrationsDir: path.resolve(basePath, 'database/migrations'),
  },
};
