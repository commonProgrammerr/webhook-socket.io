const path = require('path');
// const { createConnection } = require('typeorm');

const isProd =
  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
const basePath = isProd ? './build/src' : './src';
const filesTypes = isProd ? '*.js' : '*.ts';
const url = isProd
  ? process.env.DATABASE_URL
  : `postgres://maint:maint@localhost:5432/dev_maint_app`;
console.log(url);
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
  // type: 'sqlite',
  // database: path.resolve(basePath, 'database/database.sqlite'),
  type: 'postgres',
  migrations: [path.resolve(basePath, 'database/migrations', filesTypes)],
  entities: [path.resolve(basePath, 'models', filesTypes)],
  cli: {
    migrationsDir: path.resolve(basePath, 'database/migrations'),
  },
  url,
  extra: isProd
    ? {
        ssl: {
          ca: process.env.SSL_CERT,
          rejectUnauthorized: false,
        },
      }
    : undefined,
  synchronize: false,
  logging: isProd,
};
