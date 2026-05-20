import { db } from "./db";

export async function logAudit(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
) {
  try {
    await db.auditLog.create({
      data: {
        actorId,
        action,
        targetType,
        targetId,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch {
    // audit failures must never break the main operation
  }
}
