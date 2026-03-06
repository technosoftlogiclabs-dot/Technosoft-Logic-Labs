import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type ContactMessage = {
  id: string;
  createdAt: string;
  ip: string;
  name: string;
  email: string;
  message: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-messages.json");
const MAX_MESSAGES = 500;

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  await ensureDataFile();

  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ContactMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function addContactMessage(input: Omit<ContactMessage, "id" | "createdAt">) {
  const current = await getContactMessages();

  const nextMessage: ContactMessage = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ip: input.ip,
    name: input.name,
    email: input.email,
    message: input.message
  };

  const next = [nextMessage, ...current].slice(0, MAX_MESSAGES);
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf8");

  return nextMessage;
}
