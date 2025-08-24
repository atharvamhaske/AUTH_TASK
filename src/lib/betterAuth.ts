import { prisma } from "./prisma";
import crypto from "crypto";

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  return prisma.session.create({
    data: { userId, token, expiresAt },
  });
}

export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) return null;
  return session;
}
