import { createConnection } from "typeorm";
console.log(process.env.DATABASE_URL)
createConnection();