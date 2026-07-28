import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { purgeExpiredReporterIps } from "./ip-retention-purge.js";

function makePrismaMock(updateManyResult: { count: number } = { count: 0 }) {
  const updateMany = mock.fn((_args: { where: unknown; data: unknown }) =>
    Promise.resolve(updateManyResult),
  );
  return {
    profileReport: { updateMany },
    _updateMany: updateMany,
  };
}

test("purges reporterIp only for reports past their expiresAt", async () => {
  const prisma = makePrismaMock({ count: 2 });
  const now = new Date("2026-07-27T00:00:00Z");

  const purged = await purgeExpiredReporterIps(prisma as any, now);

  assert.equal(purged, 2);
  assert.equal(prisma._updateMany.mock.calls.length, 1);

  const [args] = prisma._updateMany.mock.calls[0].arguments;
  assert.deepEqual(args.where, {
    expiresAt: { lte: now },
    reporterIp: { not: null },
  });
  assert.deepEqual(args.data, { reporterIp: null });
});

test("is a no-op when nothing has expired", async () => {
  const prisma = makePrismaMock({ count: 0 });

  const purged = await purgeExpiredReporterIps(prisma as any, new Date());

  assert.equal(purged, 0);
});
