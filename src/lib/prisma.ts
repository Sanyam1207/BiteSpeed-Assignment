import dotenv from "dotenv";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

dotenv.config({
    path: ".././.env",
});
console.log(`Connecting to database at ${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}...`);
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,      // ! = assert not undefined
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export { prisma };