import assert from "node:assert/strict";
import { test } from "node:test";
import { getClientIdentifier } from "./rate-limit.ts";

const req = (headers: Record<string, string>) => new Request("http://x", { headers });

test("trusts CF-Connecting-IP only when the peer is a Cloudflare edge", () => {
  assert.equal(getClientIdentifier(req({ "x-forwarded-for": "172.70.1.2", "cf-connecting-ip": "203.0.113.9" })), "203.0.113.9");
  assert.equal(getClientIdentifier(req({ "x-forwarded-for": "2606:4700::1", "cf-connecting-ip": "2001:db8::5" })), "2001:db8::5");
  // Direct to the origin: a forged CF header is ignored.
  assert.equal(getClientIdentifier(req({ "x-forwarded-for": "198.51.100.7", "cf-connecting-ip": "203.0.113.9" })), "198.51.100.7");
  assert.equal(getClientIdentifier(req({})), "anonymous");
});
