import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid multiple prisma instances in dev with hot reload
  // (Bun/Node adds globalThis between reloads)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // optional: helpful for debugging
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
