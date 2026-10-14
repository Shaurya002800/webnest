import assert from "node:assert/strict";
import { access, readdir, stat } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

const directorySize = async (url) => {
  const entries = await readdir(url, { withFileTypes: true });
  return entries.reduce(async (totalPromise, entry) => {
    const total = await totalPromise;
    const child = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, url);
    return total + (entry.isDirectory() ? await directorySize(child) : (await stat(child)).size);
  }, Promise.resolve(0));
};

const recordingDb = () => {
  const calls = [];
  const DB = {
    prepare(sql) {
      const statement = { sql, values: [], bind(...values) { this.values = values; return this; }, async run() { calls.push({ sql: this.sql, values: this.values }); return { success: true }; }, async all() { return { results: [] }; } };
      return statement;
    },
    async batch(statements) { return statements.map(() => ({ results: [] })); },
  };
  return { DB, calls };
};

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("serves known routes with route-specific metadata", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/free-audit?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "<html><head><title>WebNest</title><meta name=\"description\" content=\"\" /><meta name=\"robots\" content=\"\" /><meta property=\"og:title\" content=\"\" /><meta property=\"og:description\" content=\"\" /></head><body>app</body></html>" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
            headers: { "content-type": url.pathname === "/index.html" ? "text/html" : "text/plain" },
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.match(await response.text(), /Free growth audit — WebNest/);
  assert.deepEqual(calls, ["/free-audit?source=share", "/index.html"]);
});

test("returns the app not-found view with an HTTP 404 for unknown routes", async () => {
  const response = await worker.fetch(new Request("https://example.test/missing", { headers: { accept: "text/html" } }), {
    ASSETS: {
      fetch: async (request) => {
        const isIndex = new URL(request.url).pathname === "/index.html";
        return new Response(isIndex ? "<html><head><title>WebNest</title><meta name=\"description\" content=\"\" /><meta name=\"robots\" content=\"\" /><meta property=\"og:title\" content=\"\" /><meta property=\"og:description\" content=\"\" /></head></html>" : "missing", { status: isIndex ? 200 : 404 });
      },
    },
  });
  assert.equal(response.status, 404);
  assert.match(await response.text(), /noindex, nofollow/);
});

test("serves robots and sitemap documents", async () => {
  const env = { ASSETS: { fetch: async () => { throw new Error("assets should not be called"); } } };
  const robots = await worker.fetch(new Request("https://example.test/robots.txt"), env);
  const siteMap = await worker.fetch(new Request("https://example.test/sitemap.xml"), env);
  assert.match(await robots.text(), /Sitemap: https:\/\/example\.test\/sitemap\.xml/);
  assert.match(await siteMap.text(), /https:\/\/example\.test\/start-project/);
});

test("validates inquiry submissions and requires persistent storage", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://example.test" },
    body: JSON.stringify({ kind: "project", fields: { name: "Shaurya", email: "hello@example.com", brief: "Build a connected website." } }),
  }), {});
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /storage is not configured/i);
});

test("stores a clean inquiry, issues a reference and optionally mirrors it to a webhook", async () => {
  const originalFetch = globalThis.fetch;
  let delivered;
  globalThis.fetch = async (_url, init) => {
    delivered = JSON.parse(init.body);
    return new Response(null, { status: 202 });
  };
  try {
    const { DB, calls } = recordingDb();
    const response = await worker.fetch(new Request("https://example.test/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://example.test" },
      body: JSON.stringify({ kind: "audit", fields: { name: "Shaurya", email: "HELLO@example.com", website_confirm: "", unknown: "drop me" } }),
    }), { DB, INQUIRY_WEBHOOK_URL: "https://hooks.example.test/webnest", BUSINESS_WHATSAPP_NUMBER: "+91 98765 43210" });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.match(result.reference, /^WN-A-/);
    assert.equal(result.whatsAppUrl, "https://wa.me/919876543210");
    assert.equal(calls.length, 1);
    assert.equal(delivered.fields.email, "hello@example.com");
    assert.equal("unknown" in delivered.fields, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("stores direct-UPI references as pending until manual bank verification", async () => {
  const { DB, calls } = recordingDb();
  const response = await worker.fetch(new Request("https://example.test/api/payment-confirmations", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://example.test" },
    body: JSON.stringify({ fields: { reference: "WN-2026-001", name: "Shaurya", email: "hello@example.com", amount: "5000", utr: "123456789012" } }),
  }), { DB });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.status, "pending");
  assert.match(result.confirmationId, /^WN-PAY-/);
  assert.equal(calls[0].values[4], 500000);
});

test("does not expose admin records without the configured access token", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/admin/records", { headers: { authorization: "Bearer wrong" } }), { ADMIN_ACCESS_TOKEN: "correct" });
  assert.equal(response.status, 401);
});

test("keeps analytics dormant until a provider is configured", async () => {
  const response = await worker.fetch(new Request("https://example.test/api/events", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://example.test" },
    body: JSON.stringify({ name: "page_view", path: "/", properties: {} }),
  }), {});
  assert.equal(response.status, 204);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});

test("keeps the production asset package within its launch budget", async () => {
  const assets = new URL("../dist/client/assets/", import.meta.url);
  assert.ok(await directorySize(assets) < 25 * 1024 * 1024, "production assets must remain below 25 MiB");
  await assert.rejects(access(new URL("morning/", assets)), /ENOENT/);
  await assert.rejects(access(new URL("reference/coffee-shop-figma.png", assets)), /ENOENT/);
});
