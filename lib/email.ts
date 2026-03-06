type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

async function sendViaResend({ name, email, message }: ContactEmailPayload) {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const toEmail = getRequiredEnv("CONTACT_TO_EMAIL") ?? getRequiredEnv("MAILERLITE_EMAIL_TO");
  const fromEmail = getRequiredEnv("CONTACT_FROM_EMAIL") ?? "onboarding@resend.dev";
  const fromName = getRequiredEnv("CONTACT_FROM_NAME") ?? "Technosoft Logic Labs";

  if (!apiKey || !toEmail) {
    throw new Error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
  }

  const subject = `Contact nou de la ${name}`;
  const text = `Nume: ${name}\nEmail: ${email}\nMesaj:\n${message}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px">Contact nou de pe site</h2>
      <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mesaj:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0">${escapeHtml(message)}</pre>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html
    })
  });

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    throw new Error(`Resend error ${res.status}: ${details}`);
  }
}

async function sendViaMailerLite({ name, email, message }: ContactEmailPayload) {
  const apiKey = getRequiredEnv("MAILERLITE_API_KEY");
  const toEmail = getRequiredEnv("MAILERLITE_EMAIL_TO") ?? getRequiredEnv("CONTACT_TO_EMAIL");

  if (!apiKey || !toEmail) {
    throw new Error("Missing MAILERLITE_API_KEY or MAILERLITE_EMAIL_TO");
  }

  const res = await fetch("https://api.mailerlite.com/api/v2/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MailerLite-ApiKey": apiKey
    },
    body: JSON.stringify({
      to: toEmail,
      from: email,
      subject: `Contact nou de la ${name}`,
      text: `Nume: ${name}\nEmail: ${email}\nMesaj: ${message}`
    })
  });

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    throw new Error(`MailerLite error ${res.status}: ${details}`);
  }
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  if (getRequiredEnv("RESEND_API_KEY")) {
    await sendViaResend(payload);
    return;
  }

  if (getRequiredEnv("MAILERLITE_API_KEY")) {
    await sendViaMailerLite(payload);
    return;
  }

  throw new Error("No email provider configured. Set RESEND_API_KEY or MAILERLITE_API_KEY.");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
