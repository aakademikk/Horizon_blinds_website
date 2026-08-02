import { NextResponse } from "next/server";
import { ENQUIRIES_TABLE, getSupabase } from "@/lib/supabase";
import { enquirySchema, newsletterSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Crude in-memory throttle. Enough to blunt casual abuse on a single instance. */
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

function throttled(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [key, value] of hits) if (now > value.reset) hits.delete(key);
  }

  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (throttled(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // Select the branch by `kind` rather than parsing a union: a Zod union
  // reports one generic failure, and the client needs per-field issues to map
  // back onto the form.
  const kind = (body as { kind?: unknown } | null)?.kind;
  const schema = kind === "newsletter" ? newsletterSchema : enquirySchema;

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot: a filled `company` field means a bot. Answer as though all is well.
  if ("company" in data && data.company) {
    return NextResponse.json({ ok: true, reference: "FSB-0000" });
  }

  const reference = `FSB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const record = {
    ...data,
    reference,
    submitted_at: new Date().toISOString(),
    source: request.headers.get("referer") ?? "direct",
    user_agent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
  };

  // Persist and notify independently — one failing must not lose the other.
  const results = await Promise.allSettled([storeEnquiry(record), forwardToWebhook(record)]);

  // "skipped" means that destination is not configured, which is a legitimate
  // deployment state. Only a destination that was configured and then failed
  // counts against us.
  const attempted = results.filter(
    (r) => r.status === "rejected" || r.value !== "skipped",
  );
  const delivered = results.filter((r) => r.status === "fulfilled" && r.value === "ok");

  if (attempted.length > 0 && delivered.length === 0) {
    console.error(
      "[enquiry] every configured delivery path failed",
      results.filter((r) => r.status === "rejected").map((r) => r.reason),
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not record your enquiry just now. Please call us on 01277 123 456 and we will pick it up straight away.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    reference,
    stored: results[0].status === "fulfilled" && results[0].value === "ok",
  });
}

type Delivery = "ok" | "skipped";

async function storeEnquiry(record: Record<string, unknown>): Promise<Delivery> {
  const supabase = getSupabase();
  // No Supabase configured is a valid deployment state, not an error.
  if (!supabase) return "skipped";

  const { error } = await supabase.from(ENQUIRIES_TABLE).insert(record);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  return "ok";
}

async function forwardToWebhook(record: Record<string, unknown>): Promise<Delivery> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return "skipped";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ENQUIRY_WEBHOOK_SECRET
          ? { "X-Webhook-Secret": process.env.ENQUIRY_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(record),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return "ok";
  } finally {
    clearTimeout(timeout);
  }
}
