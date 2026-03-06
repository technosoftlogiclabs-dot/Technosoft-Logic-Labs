import { getContactMessages } from "@/lib/contact-store";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("ro-RO", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch {
    return value;
  }
}

export default async function AdminPage() {
  const messages = await getContactMessages();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 rounded-2xl border border-cyan-300/15 bg-slate-900/60 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Mesaje contact</h1>
        <p className="mt-1 text-sm text-slate-400">Total mesaje: {messages.length}</p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-5 text-slate-300">
          Nu există mesaje momentan.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/55 p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-100">{item.name}</p>
                  <p className="text-sm text-cyan-200/80">{item.email}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>{formatDate(item.createdAt)}</p>
                  <p>IP: {item.ip}</p>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-200">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
