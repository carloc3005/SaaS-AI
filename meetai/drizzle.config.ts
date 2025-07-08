import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: (() => {
    if (!process.env.DATABASE_URL) {
      throw new Error("Missing DATABASE_URL for Drizzle Kit");
    }
    return { url: process.env.DATABASE_URL };
  })(),});
