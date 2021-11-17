const path = require('path')
const basePath = process.env.NODE_ENV === 'dev' ? './src' : './build/src' 

module.exports = {
  type: "sqlite",
  database:  path.resolve(basePath,"database/database.sqlite"),
  migrations: [path.resolve(basePath,"database/migrations/*ts")],
  entities: [path.resolve(basePath,"models/*.ts")],
  cli: {
    migrationsDir: path.resolve(basePath, "./src/database/migrations")
  }
}