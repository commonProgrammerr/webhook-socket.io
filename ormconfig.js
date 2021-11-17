const path = require('path')
const isDev = process.env.NODE_ENV === 'dev'
const basePath = isDev ? './src' : './build/src' 

module.exports = {
  type: "sqlite",
  database:  path.resolve(basePath,"database/database.sqlite"),
  migrations: [path.resolve(basePath,"database/migrations", isDev ?  "*.ts" : "*.js")],
  entities: [path.resolve(basePath,"models", isDev ?  "*.ts" : "*.js")],
  cli: {
    migrationsDir: path.resolve(basePath, "./src/database/migrations")
  }
}