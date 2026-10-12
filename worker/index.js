const ROUTES = {
  "/": { title: "WebNest — Connected digital growth systems", description: "WebNest builds connected brands, websites, growth systems and automation for ambitious businesses." },
  "/free-audit": { title: "Free growth audit — WebNest", description: "Request a free WebNest review of your website, visibility, customer journey and growth opportunities." },
  "/start-project": { title: "Start a project — WebNest", description: "Tell WebNest what you want to build and get a clear recommendation for the right digital growth system." },
  "/privacy": { title: "Privacy policy — WebNest", description: "How WebNest collects, uses, protects and retains information submitted through this website." },
  "/terms": { title: "Terms of use — WebNest", description: "The terms that apply when using the WebNest website and submitting a business enquiry." },
};

const inquiryAttempts = new Map();
const INQUIRY_WINDOW_MS = 10 * 60 * 1000;
const INQUIRY_LIMIT = 5;
const ALLOWED_FIELDS = ["name", "email", "company", "website", "challenge", "brief", "package", "service", "industry", "reference", "budget", "timeline"];
const ANALYTICS_EVENTS = new Set(["page_view", "audit_cta_clicked", "project_cta_clicked", "theme_toggled", "faq_toggled", "inquiry_submit_started", "inquiry_submit_succeeded", "inquiry_submit_failed"]);

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const withSecurityHeaders = (response, overrides = {}) => {
  const headers = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([name, value]) => headers.set(name, value));
  Object.entries(overrides).forEach(([name, value]) => headers.set(name, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

const injectRouteMetadata = async (response, requestUrl, route, status = 200, analyticsEnabled = false) => {
  const canonical = `${requestUrl.origin}${requestUrl.pathname}`;
  const title = escapeHtml(route?.title || "Page not found — WebNest");
  const description = escapeHtml(route?.description || "The requested page could not be found.");
  const robots = route ? "index, follow" : "noindex, nofollow";
  const socialImage = `${requestUrl.origin}/assets/optimized/hero-room-clean.jpg`;
  const schemaNonce = requestUrl.pathname === "/" ? crypto.randomUUID() : "";
  const schema = requestUrl.pathname === "/" ? `<script nonce="${schemaNonce}" type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "WebNest",
    url: requestUrl.origin,
    email: "hello@webnest.in",
    description: route.description,
    areaServed: "India",
    serviceType: ["Web development", "SEO and growth", "Business automation", "AI solutions"],
  }).replace(/</g, "\\u003c")}</script>` : "";
  let html = await response.text();

  html = html
    .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots"[^>]*>/i, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${description}" />`)
    .replace("</head>", `<link rel="canonical" href="${canonical}" /><meta property="og:site_name" content="WebNest" /><meta property="og:locale" content="en_IN" /><meta property="og:url" content="${canonical}" /><meta property="og:image" content="${socialImage}" /><meta name="twitter:title" content="${title}" /><meta name="twitter:description" content="${description}" /><meta name="twitter:image" content="${socialImage}" />${analyticsEnabled ? '<meta name="webnest-analytics" content="/api/events" />' : ''}${schema}</head>`);

  const csp = schemaNonce ? securityHeaders["Content-Security-Policy"].replace("script-src 'self'", `script-src 'self' 'nonce-${schemaNonce}'`) : securityHeaders["Content-Security-Policy"];
  return withSecurityHeaders(new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } }), { "Content-Security-Policy": csp });
};

const sitemap = (origin) => {
  const urls = Object.keys(ROUTES).map((path) => `<url><loc>${origin}${path}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
};

const json = (body, status = 200) => withSecurityHeaders(new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
}));

const handleInquiry = async (request, env, url) => {
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ message: "Invalid request origin." }, 403);
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 20_000) return json({ message: "Request is too large." }, 413);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Invalid request." }, 400);
  }

  const kind = payload?.kind;
  const fields = payload?.fields || {};
  if (!['audit', 'project'].includes(kind)) return json({ message: "Invalid enquiry type." }, 400);
  if (typeof fields.website_confirm === "string" && fields.website_confirm.trim()) return json({ ok: true });

  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : "";
  const brief = typeof fields.brief === "string" ? fields.brief.trim() : "";
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return json({ message: "Please provide a valid name and email address." }, 400);
  }
  if (kind === "project" && (brief.length < 10 || brief.length > 5000)) {
    return json({ message: "Please add a short project brief." }, 400);
  }

  const clientIp = request.headers.get("cf-connecting-ip");
  if (clientIp) {
    const now = Date.now();
    const recent = (inquiryAttempts.get(clientIp) || []).filter((timestamp) => now - timestamp < INQUIRY_WINDOW_MS);
    if (recent.length >= INQUIRY_LIMIT) return json({ message: "Too many requests. Please wait a few minutes and try again." }, 429);
    recent.push(now);
    inquiryAttempts.set(clientIp, recent);
  }

  if (!env.INQUIRY_WEBHOOK_URL) return json({ message: "Submission delivery is not configured yet. Please email hello@webnest.in." }, 503);

  let destination;
  try {
    destination = new URL(env.INQUIRY_WEBHOOK_URL);
  } catch {
    return json({ message: "Submission delivery is unavailable. Please email hello@webnest.in." }, 503);
  }
  if (destination.protocol !== "https:") return json({ message: "Submission delivery is unavailable. Please email hello@webnest.in." }, 503);

  const cleanFields = Object.fromEntries(ALLOWED_FIELDS.flatMap((field) => {
    const value = fields[field];
    if (typeof value !== "string") return [];
    return [[field, value.trim().slice(0, 5000)]];
  }));
  cleanFields.name = name;
  cleanFields.email = email;
  const headers = { "Content-Type": "application/json", "User-Agent": "WebNest-Inquiry/1.0" };
  if (env.INQUIRY_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${env.INQUIRY_WEBHOOK_TOKEN}`;

  try {
    const delivery = await fetch(destination, {
      method: "POST",
      headers,
      body: JSON.stringify({ source: "webnest", kind, submittedAt: new Date().toISOString(), fields: cleanFields }),
      signal: AbortSignal.timeout(8000),
    });
    if (!delivery.ok) return json({ message: "We could not send your request. Please try again or email hello@webnest.in." }, 502);
    return json({ ok: true });
  } catch {
    return json({ message: "We could not send your request. Please try again or email hello@webnest.in." }, 502);
  }
};

const handleAnalytics = async (request, env, url) => {
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ message: "Invalid request origin." }, 403);
  if (!env.ANALYTICS_WEBHOOK_URL) return withSecurityHeaders(new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } }));
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ message: "Invalid event." }, 400);
  }
  if (!ANALYTICS_EVENTS.has(payload?.name) || typeof payload?.path !== "string" || payload.path.length > 200) return json({ message: "Invalid event." }, 400);
  const properties = Object.fromEntries(Object.entries(payload.properties || {}).slice(0, 10).flatMap(([key, value]) => {
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(key) || !["string", "number", "boolean"].includes(typeof value)) return [];
    return [[key, typeof value === "string" ? value.slice(0, 120) : value]];
  }));
  const headers = { "Content-Type": "application/json", "User-Agent": "WebNest-Analytics/1.0" };
  if (env.ANALYTICS_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${env.ANALYTICS_WEBHOOK_TOKEN}`;
  try {
    const destination = new URL(env.ANALYTICS_WEBHOOK_URL);
    if (destination.protocol !== "https:") return json({ message: "Analytics delivery is unavailable." }, 503);
    await fetch(destination, { method: "POST", headers, body: JSON.stringify({ source: "webnest", name: payload.name, path: payload.path, properties, occurredAt: new Date().toISOString() }), signal: AbortSignal.timeout(5000) });
  } catch {
    return withSecurityHeaders(new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } }));
  }
  return withSecurityHeaders(new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } }));
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/inquiries") return handleInquiry(request, env, url);
    if (url.pathname === "/api/events") return handleAnalytics(request, env, url);
    if (request.method === "GET" && url.pathname === "/robots.txt") {
      return withSecurityHeaders(new Response(`User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } }));
    }
    if (request.method === "GET" && url.pathname === "/sitemap.xml") {
      return withSecurityHeaders(new Response(sitemap(url.origin), { headers: { "Content-Type": "application/xml; charset=utf-8" } }));
    }

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    const isDocumentRequest = acceptsHtml && ["GET", "HEAD"].includes(request.method);

    if (response.status !== 404) {
      const contentType = response.headers.get("content-type") || "";
      if (isDocumentRequest && contentType.includes("text/html")) {
        return injectRouteMetadata(response, url, ROUTES[url.pathname], ROUTES[url.pathname] ? 200 : 404, Boolean(env.ANALYTICS_WEBHOOK_URL));
      }
      return withSecurityHeaders(response);
    }

    if (!isDocumentRequest || url.pathname.startsWith("/api/")) return withSecurityHeaders(response);

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    const appShell = await env.ASSETS.fetch(new Request(indexUrl, request));
    return injectRouteMetadata(appShell, url, ROUTES[url.pathname], ROUTES[url.pathname] ? 200 : 404, Boolean(env.ANALYTICS_WEBHOOK_URL));
  },
};
