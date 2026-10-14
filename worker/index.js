const ROUTES = {
  "/": { title: "WebNest — Connected digital growth systems", description: "WebNest builds connected brands, websites, growth systems and automation for ambitious businesses." },
  "/free-audit": { title: "Free growth audit — WebNest", description: "Request a free WebNest review of your website, visibility, customer journey and growth opportunities." },
  "/start-project": { title: "Start a project — WebNest", description: "Tell WebNest what you want to build and get a clear recommendation for the right digital growth system." },
  "/privacy": { title: "Privacy policy — WebNest", description: "How WebNest collects, uses, protects and retains information submitted through this website." },
  "/terms": { title: "Terms of use — WebNest", description: "The terms that apply when using the WebNest website and submitting a business enquiry." },
  "/payment": { title: "Secure UPI payment — WebNest", description: "Pay an approved WebNest quotation by direct UPI and submit the bank reference for verification.", noIndex: true },
  "/admin": { title: "Business desk — WebNest", description: "Protected WebNest lead and payment management.", noIndex: true },
};

const inquiryAttempts = new Map();
const INQUIRY_WINDOW_MS = 10 * 60 * 1000;
const INQUIRY_LIMIT = 5;
const ALLOWED_FIELDS = ["name", "email", "phone", "contact_preference", "company", "website", "challenge", "brief", "package", "service", "industry", "reference", "budget", "timeline"];
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
  const robots = route && !route.noIndex ? "index, follow" : "noindex, nofollow";
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
  const urls = Object.entries(ROUTES).filter(([, route]) => !route.noIndex).map(([path]) => `<url><loc>${origin}${path}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
};

const json = (body, status = 200) => withSecurityHeaders(new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
}));

const makeReference = (prefix) => {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `WN-${prefix}-${date}-${suffix}`;
};

const sendEmail = async (env, { to, subject, html, replyTo }) => {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !to) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    signal: AbortSignal.timeout(8000),
  });
  return response.ok;
};

const notifyLead = async (env, reference, kind, fields) => {
  const businessName = env.LEGAL_BUSINESS_NAME || "WebNest";
  const fieldRows = Object.entries(fields).map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${escapeHtml(key)}</strong></td><td>${escapeHtml(String(value || "—"))}</td></tr>`).join("");
  const admin = sendEmail(env, { to: env.BUSINESS_EMAIL, replyTo: fields.email, subject: `${reference} · New ${kind} enquiry`, html: `<h2>New ${escapeHtml(kind)} enquiry</h2><p>Reference: <strong>${reference}</strong></p><table>${fieldRows}</table>` });
  const customer = sendEmail(env, { to: fields.email, subject: `${reference} · ${businessName} received your request`, html: `<h2>Thank you, ${escapeHtml(fields.name)}.</h2><p>${escapeHtml(businessName)} received your ${escapeHtml(kind)} request.</p><p>Keep this reference for future messages: <strong>${reference}</strong>.</p><p>We will review the details and contact you using your preferred method.</p>` });
  return Promise.allSettled([admin, customer]);
};

const notifyPayment = async (env, confirmationId, fields, amountPaise) => {
  const businessName = env.LEGAL_BUSINESS_NAME || "WebNest";
  const amount = `₹${(amountPaise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const admin = sendEmail(env, { to: env.BUSINESS_EMAIL, replyTo: fields.email, subject: `${fields.reference} · Payment verification requested`, html: `<h2>Verify this bank credit</h2><p>Confirmation: <strong>${confirmationId}</strong></p><p>Quotation: ${escapeHtml(fields.reference)}<br>Amount: ${amount}<br>UTR: ${escapeHtml(fields.utr)}<br>Customer: ${escapeHtml(fields.name)} (${escapeHtml(fields.email)})</p><p>Mark it verified only after the matching credit appears in the bank account.</p>` });
  const customer = sendEmail(env, { to: fields.email, subject: `${confirmationId} · Payment reference received`, html: `<h2>Your reference is pending verification.</h2><p>${escapeHtml(businessName)} recorded UTR <strong>${escapeHtml(fields.utr)}</strong> for quotation <strong>${escapeHtml(fields.reference)}</strong>.</p><p>This is not a payment receipt. We will confirm it after checking the matching bank credit.</p>` });
  return Promise.allSettled([admin, customer]);
};

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

  const cleanFields = Object.fromEntries(ALLOWED_FIELDS.flatMap((field) => {
    const value = fields[field];
    if (typeof value !== "string") return [];
    return [[field, value.trim().slice(0, 5000)]];
  }));
  cleanFields.name = name;
  cleanFields.email = email;
  cleanFields.contact_preference = ["email", "whatsapp", "phone"].includes(cleanFields.contact_preference) ? cleanFields.contact_preference : "email";
  if (cleanFields.phone && !/^[+\d][\d\s()-]{6,24}$/.test(cleanFields.phone)) return json({ message: "Please provide a valid phone number or leave it blank." }, 400);
  if (cleanFields.contact_preference !== "email" && !cleanFields.phone) return json({ message: "Please add a phone number for your preferred contact method." }, 400);
  if (!env.DB?.prepare) return json({ message: "Secure enquiry storage is not configured yet. Please email hello@webnest.in." }, 503);

  const reference = makeReference(kind === "audit" ? "A" : "P");
  const now = new Date().toISOString();
  try {
    await env.DB.prepare("INSERT INTO leads (id, kind, name, email, phone, contact_preference, company, fields_json, status, consent_version, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'new', '2026-10-14', ?9, ?9)")
      .bind(reference, kind, name, email, cleanFields.phone || null, cleanFields.contact_preference, cleanFields.company || null, JSON.stringify(cleanFields), now).run();
  } catch {
    return json({ message: "We could not securely save your request. Please try again." }, 502);
  }

  await notifyLead(env, reference, kind, cleanFields);
  if (env.INQUIRY_WEBHOOK_URL) {
    try {
      const destination = new URL(env.INQUIRY_WEBHOOK_URL);
      if (destination.protocol === "https:") await fetch(destination, { method: "POST", headers: { "Content-Type": "application/json", ...(env.INQUIRY_WEBHOOK_TOKEN ? { Authorization: `Bearer ${env.INQUIRY_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ source: "webnest", reference, kind, submittedAt: now, fields: cleanFields }), signal: AbortSignal.timeout(8000) });
    } catch { /* The D1 record remains the source of truth. */ }
  }
  const digits = String(env.BUSINESS_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  return json({ ok: true, reference, whatsAppUrl: digits ? `https://wa.me/${digits}` : null });
};

const handlePaymentConfirmation = async (request, env, url) => {
  if (request.method !== "POST") return json({ message: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ message: "Invalid request origin." }, 403);
  let payload;
  try { payload = await request.json(); } catch { return json({ message: "Invalid request." }, 400); }
  const fields = payload?.fields || {};
  if (typeof fields.website_confirm === "string" && fields.website_confirm.trim()) return json({ ok: true });
  const reference = typeof fields.reference === "string" ? fields.reference.trim().toUpperCase() : "";
  const name = typeof fields.name === "string" ? fields.name.trim() : "";
  const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : "";
  const utr = typeof fields.utr === "string" ? fields.utr.trim().toUpperCase().replace(/\s/g, "") : "";
  const amountPaise = Math.round(Number(fields.amount) * 100);
  if (!/^WN-[A-Z0-9-]{4,44}$/.test(reference) || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[A-Z0-9-]{6,50}$/.test(utr) || !Number.isSafeInteger(amountPaise) || amountPaise <= 0) return json({ message: "Please check the quotation, contact details, amount and bank reference." }, 400);
  if (!env.DB?.prepare) return json({ message: "Payment-reference storage is not configured yet." }, 503);
  const confirmationId = makeReference("PAY");
  const now = new Date().toISOString();
  try {
    await env.DB.prepare("INSERT INTO payment_confirmations (id, quote_reference, name, email, amount_paise, utr, status, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7, ?7)").bind(confirmationId, reference, name, email, amountPaise, utr, now).run();
  } catch {
    return json({ message: "That bank reference is already recorded or could not be saved. Contact WebNest if you need help." }, 409);
  }
  await notifyPayment(env, confirmationId, { reference, name, email, utr }, amountPaise);
  return json({ ok: true, confirmationId, status: "pending" });
};

const secureEquals = async (left, right) => {
  if (!left || !right) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", encoder.encode(left)), crypto.subtle.digest("SHA-256", encoder.encode(right))]);
  return Array.from(new Uint8Array(a)).every((value, index) => value === new Uint8Array(b)[index]);
};

const authorizeAdmin = async (request, env) => {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return secureEquals(supplied, env.ADMIN_ACCESS_TOKEN || "");
};

const handleAdminRecords = async (request, env, url) => {
  if (!await authorizeAdmin(request, env)) return json({ message: "Unauthorized." }, 401);
  if (!env.DB?.prepare) return json({ message: "Database unavailable." }, 503);
  if (request.method === "GET" && url.pathname === "/api/admin/records") {
    const [leadResult, paymentResult] = await env.DB.batch([
      env.DB.prepare("SELECT id, kind, name, email, phone, contact_preference, company, fields_json, status, created_at FROM leads ORDER BY created_at DESC LIMIT 100"),
      env.DB.prepare("SELECT id, quote_reference, name, email, amount_paise, utr, status, created_at FROM payment_confirmations ORDER BY created_at DESC LIMIT 100"),
    ]);
    return json({ leads: leadResult.results || [], payments: paymentResult.results || [] });
  }
  if (request.method === "PATCH") {
    const match = url.pathname.match(/^\/api\/admin\/records\/(lead|payment)\/([^/]+)$/);
    if (!match) return json({ message: "Not found." }, 404);
    let payload;
    try { payload = await request.json(); } catch { return json({ message: "Invalid request." }, 400); }
    const [, kind, id] = match;
    const allowed = kind === "lead" ? ["new", "contacted", "quoted", "accepted", "completed", "closed"] : ["pending", "verified", "rejected"];
    if (!allowed.includes(payload?.status)) return json({ message: "Invalid status." }, 400);
    const table = kind === "lead" ? "leads" : "payment_confirmations";
    await env.DB.prepare(`UPDATE ${table} SET status = ?1, updated_at = ?2 WHERE id = ?3`).bind(payload.status, new Date().toISOString(), decodeURIComponent(id)).run();
    return json({ ok: true });
  }
  return json({ message: "Method not allowed." }, 405);
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
    if (url.pathname === "/api/payment-confirmations") return handlePaymentConfirmation(request, env, url);
    if (url.pathname === "/api/admin/records" || url.pathname.startsWith("/api/admin/records/")) return handleAdminRecords(request, env, url);
    if (request.method === "GET" && url.pathname === "/api/business-config") {
      const digits = String(env.BUSINESS_WHATSAPP_NUMBER || "").replace(/\D/g, "");
      return json({ businessName: env.LEGAL_BUSINESS_NAME || "WebNest", businessEmail: env.BUSINESS_EMAIL || "", whatsAppUrl: digits ? `https://wa.me/${digits}` : null, upiId: env.BUSINESS_UPI_ID || null });
    }
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
