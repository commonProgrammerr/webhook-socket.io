const path = require('path')
const isProd = process.env.NODE_ENV === 'prod'
const basePath = isProd ? './build/src' : './src' 
const filesTypes = isProd ?  "*.js" : '*.ts'

module.exports = {
  type: "sqlite",
  database:  path.resolve(basePath,"database/database.sqlite"),
  migrations: [path.resolve(basePath,"database/migrations", filesTypes)],
  entities: [path.resolve(basePath,"models", filesTypes)],
  cli:  {
    migrationsDir: path.resolve(basePath, "database/migrations")
  }
}