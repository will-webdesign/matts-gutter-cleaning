import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/*
  Prisma 7 connects through a driver adapter. Local dev uses the better-sqlite3
  adapter against the file in DATABASE_URL.

  To switch to Supabase/Postgres for production:
    1. In prisma/schema.prisma set datasource provider = "postgresql"
    2. npm install @prisma/adapter-pg pg
    3. Replace the adapter below with:
         import { PrismaPg } from "@prisma/adapter-pg";
         const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    4. Set DATABASE_URL to your Supabase pooled connection string.
*/

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient() {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
