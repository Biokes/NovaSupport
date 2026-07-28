import { prisma } from "../db.js";
import { logger } from "../logger.js";

const RETENTION_PURGE_JOB_NAME = "ip-retention-purge";
const PURGE_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 * Null out reporterIp on any ProfileReport past its retention window
 * (expiresAt). The report itself (reason/details/profileId) is kept for
 * moderation history — only the IP address is privacy-sensitive (#870).
 */
export async function purgeExpiredReporterIps(prismaClient = prisma, now = new Date()) {
  const result = await prismaClient.profileReport.updateMany({
    where: {
      expiresAt: { lte: now },
      reporterIp: { not: null },
    },
    data: { reporterIp: null },
  });

  if (result.count > 0) {
    logger.info({ purged: result.count }, "Purged expired reporter IPs");
  }

  return result.count;
}

async function getLastPurgeRunAt(): Promise<Date | null> {
  const row = await prisma.schedulerJob.findUnique({
    where: { name: RETENTION_PURGE_JOB_NAME },
  });
  return row?.lastRunAt ?? null;
}

async function markPurgeRunAt(at: Date): Promise<void> {
  await prisma.schedulerJob.upsert({
    where: { name: RETENTION_PURGE_JOB_NAME },
    create: { name: RETENTION_PURGE_JOB_NAME, lastRunAt: at },
    update: { lastRunAt: at },
  });
}

/**
 * Run the purge only if at least 24h have elapsed since the last successful
 * run, so a process restart doesn't re-run it immediately.
 */
async function maybeRunPurge(): Promise<void> {
  const lastRunAt = await getLastPurgeRunAt();
  const now = Date.now();

  if (lastRunAt !== null && now - lastRunAt.getTime() < PURGE_INTERVAL_MS) {
    return;
  }

  const runAt = new Date(now);
  await purgeExpiredReporterIps();
  await markPurgeRunAt(runAt);
}

let purgeInterval: ReturnType<typeof setInterval> | null = null;

export function startIpRetentionPurgeScheduler() {
  logger.info("IP retention purge scheduler starting...");

  maybeRunPurge().catch((err) => {
    logger.error({ err }, "Error in initial maybeRunPurge check");
  });

  purgeInterval = setInterval(() => {
    maybeRunPurge().catch((err) => {
      logger.error({ err }, "Error in maybeRunPurge interval");
    });
  }, PURGE_INTERVAL_MS);
}

export function stopIpRetentionPurgeScheduler() {
  if (purgeInterval) {
    clearInterval(purgeInterval);
    purgeInterval = null;
  }
}
