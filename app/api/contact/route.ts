import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { addContactMessage } from "@/lib/contact-store";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
};

const requestBuckets = new Map<string, { count: number; start: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = requestBuckets.get(ip);
  if (!current || now - current.start > WINDOW_MS) {
    requestBuckets.set(ip, { count: 1, start: now });
    return false;
  }

  current.count += 1;
  requestBuckets.set(ip, current);
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

function validate(payload: ContactPayload) {
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const message = payload.message?.trim() ?? "";
  const company = payload.company?.trim() ?? "";

  if (company) return { ok: false, message: "Spam detectat." };
  if (name.length < 2) return { ok: false, message: "Nume invalid." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Email invalid." };
  if (message.length < 20) return { ok: false, message: "Mesaj prea scurt." };

  return { ok: true, value: { name, email, message } };
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Prea multe solicitări. Încearcă din nou în scurt timp." }, { status: 429 });
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Payload invalid." }, { status: 400 });
  }

  const checked = validate(body);
  if (!checked.ok || !checked.value) {
    return NextResponse.json({ ok: false, message: checked.message }, { status: 400 });
  }

  const { name, email, message } = checked.value;
  console.log("[contact] inbound lead", {
    timestamp: new Date().toISOString(),
    ip,
    name,
    email,
    message
  });

  try {
    await addContactMessage({
      ip,
      name,
      email,
      message
    });
  } catch (err) {
    console.error("[contact] message storage error", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Eroare la salvarea mesajului. Încearcă din nou mai târziu."
      },
      { status: 500 }
    );
  }

  try {
    await sendContactEmail(checked.value);
  } catch (err) {
    console.error("[contact] email send error", err);
  }

  return NextResponse.json({ ok: true });
}