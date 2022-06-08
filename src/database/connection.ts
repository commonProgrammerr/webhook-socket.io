import { createConnection } from "typeorm";
console.log("Start database connection whit ", process.env.NODE_ENV, " configuration")
createConnection();