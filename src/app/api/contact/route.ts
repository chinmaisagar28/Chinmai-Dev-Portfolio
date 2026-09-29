import { NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * SECURE CONTACT ENDPOINT (spec §35–38)
 *
 * Defense layers:
 *  - honeypot field ("company_website") → silent fake-success for bots
 *  - in-memory rate limit: 5 submissions / 10 min / IP (hashed at rest)
 *  - zod schema validation, strict length caps
 *  - attachment: extension + MIME + size whitelist, randomized sanitized filename
 *  - messages persisted via Prisma; nothing sensitive echoed back
 *
 * To add email forwarding later: set SMTP_* / RESEND_API_KEY env vars and
 * dispatch after the DB write — credentials stay server-side only.
 */

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "db", "uploads");

const ALLOWED: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  png: ["image/png"],
  jpg: ["image/jpeg", "image/jpg"],
  jpeg: ["image/jpeg", "image/jpg"],
  zip: ["application/zip", "application/x-zip-compressed", "application/octet-stream"],
};
const MAX_ATTACHMENT = 5 * 1024 * 1024;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.email("That email doesn't look right").max(254),
  subject: z.string().trim().min(2, "Subject is too short").max(120),
  message: z.string().trim().min(10, "Message is a little short").max(5000),
});

/* ---------------- rate limiting ---------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/* periodic cleanup so the map never grows unbounded */
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
}, 60 * 1000);
if (typeof cleanup.unref === "function") cleanup.unref();

/* ---------------- helpers ---------------- */

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "local";
  const ip = fwd.split(",")[0].trim() || "local";
  return createHash("sha256").update(`contact:${ip}`).digest("hex").slice(0, 24);
}

function sanitizeFilename(original: string): string {
  const base = original.split(/[\\/]/).pop() ?? "file";
  const cleaned = base.replace(/[^\w.\-]+/g, "_").replace(/^\.+/, "").slice(-80);
  return `${Date.now()}-${randomUUID().slice(0, 8)}-${cleaned || "file"}`;
}

/* ---------------- handler ---------------- */

export async function POST(req: Request) {
  try {
    const key = clientKey(req);
    if (rateLimited(key)) {
      return NextResponse.json(
        { error: "Too many messages — please wait a few minutes." },
        { status: 429 }
      );
    }

    const form = await req.formData();

    /* honeypot: bots fill it, humans never see it — answer success, store nothing */
    if ((form.get("company_website") ?? "").toString().trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const payload = {
      name: form.get("name")?.toString() ?? "",
      email: form.get("email")?.toString() ?? "",
      subject: form.get("subject")?.toString() ?? "",
      message: form.get("message")?.toString() ?? "",
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Please check your details.";
      return NextResponse.json({ error: first }, { status: 400 });
    }

    /* attachment — optional, validated hard */
    let attachmentName: string | null = null;
    let attachmentPath: string | null = null;
    let attachmentSize: number | null = null;

    const file = form.get("attachment");
    if (file && file instanceof File && file.size > 0) {
      if (file.size > MAX_ATTACHMENT) {
        return NextResponse.json({ error: "Attachment exceeds 5MB." }, { status: 400 });
      }
      const ext = (file.name.split(".").pop() ?? "").toLowerCase();
      const allowedMimes = ALLOWED[ext];
      if (!allowedMimes || !allowedMimes.includes(file.type)) {
        return NextResponse.json(
          { error: "Attachment type not allowed (PDF, DOC, DOCX, PNG, JPG, ZIP)." },
          { status: 400 }
        );
      }
      attachmentName = sanitizeFilename(file.name);
      attachmentSize = file.size;
      await mkdir(UPLOAD_DIR, { recursive: true });
      const absPath = path.join(UPLOAD_DIR, attachmentName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(absPath, buffer);
      attachmentPath = path.relative(process.cwd(), absPath);
    }

    const record = await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        attachmentName,
        attachmentPath,
        attachmentSize,
        ipHash: key,
      },
    });

    /* backend confirmed — only now may the UI show success (spec §38) */
    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("[contact] submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email me directly." },
      { status: 500 }
    );
  }
}
