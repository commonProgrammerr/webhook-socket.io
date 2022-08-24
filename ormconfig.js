const path = require('path');
// const { createConnection } = require('typeorm');

const isProd =
  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
const basePath = isProd ? './build/src' : './src';
const filesTypes = isProd ? '*.js' : '*.ts';

const url =
  'mysql://mimodev:Arer3366547@10@mimodev.mysql.dbaas.com.br:3306/mimodev';
// : 'mysql://mimodev:Arer3366547@10@mimodev.mysql.dbaas.com.br:3306/mimodev';
// `postgres://postgres:postgres@localhost:5432/dev_maint_app`;

console.log('connecting to', url);
module.exports = {
  type: 'mysql',
  migrations: [path.resolve(basePath, 'database/migrations', filesTypes)],
  entities: [path.resolve(basePath, 'models', filesTypes)],
  cli: {
    migrationsDir: path.resolve(basePath, 'database/migrations'),
    entitiesDir: path.resolve(basePath, 'models'),
  },
  url,
  // extra: isProd
  //   ? {
  //       ssl: {
  //         ca: process.env.SSL_CERT,
  //         rejectUnauthorized: false,
  //       },
  //     }
  //   : undefined,
  synchronize: false,
  // logging: isProd,
  logging: false,
};
