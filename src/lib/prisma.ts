/**
 * LIKEFOOD - Vietnamese Specialty Marketplace
 * Copyright (c) 2026 LIKEFOOD Team
 * Licensed under the MIT License
 * https://github.com/tranquocvu-3011/likefood
 */

import { PrismaClient } from "../generated/client";
import { validateEnv } from "./env";

// SEC-07: Validate env vars at startup
// Note: throw (not process.exit) so Next.js handles it gracefully in dev
try {
  validateEnv();
} catch (error) {
  console.error("❌ Environment validation failed:", error);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
  // In dev: let the error propagate so Next.js shows error overlay instead of crashing
  throw error;
}

const prismaClientSingleton = () => {
    return new PrismaClient();
};

/* eslint-disable no-var */
declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
/* eslint-enable no-var */

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
