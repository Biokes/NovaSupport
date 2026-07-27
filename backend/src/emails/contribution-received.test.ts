import { test } from "node:test";
import assert from "node:assert/strict";
import { contributionReceivedEmail } from "./contribution-received.js";

const supporterAddress = "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWX";

test("subject truncates the supporter's wallet address", () => {
  const { subject } = contributionReceivedEmail({
    creatorName: "Alice",
    supporterAddress,
    amount: "10",
    assetCode: "XLM",
  });

  assert.equal(subject, "GABCDE...UVWX sent you 10 XLM");
  assert.ok(!subject.includes(supporterAddress));
});

test("text and html bodies still contain the full wallet address", () => {
  const { text, html } = contributionReceivedEmail({
    creatorName: "Alice",
    supporterAddress,
    amount: "10",
    assetCode: "XLM",
  });

  assert.ok(text.includes(supporterAddress));
  assert.ok(html.includes(supporterAddress));
});

test("includes the optional supporter message", () => {
  const { text, html } = contributionReceivedEmail({
    creatorName: "Alice",
    supporterAddress,
    amount: "10",
    assetCode: "XLM",
    message: "Keep up the great work!",
  });

  assert.ok(text.includes("Keep up the great work!"));
  assert.ok(html.includes("Keep up the great work!"));
});
