import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

function assertDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL env var is not set");
  }
  return url;
}

const sql = neon(assertDatabaseUrl());
export const db = drizzle(sql);