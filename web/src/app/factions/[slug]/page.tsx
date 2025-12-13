import { notFound } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Faction = {
  id: number;
  slug: string;
  name: string;
  timeActive?: string | null;
  alignment?: string | null;
  leader?: string | null;
  purpose?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags?: { id: number; name: string }[];
  primaryMembers?: {
    slug: string;
    name: string;
    callsign?: string | null;
    role?: string | null;
  }[];
  ships?: { slug: string; name: string }[];
};

async function getFaction(slug: string): Promise<Faction | null> {
  const res = await fetch(`${API}/api/factions/slug/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-4xl mx-auto space-y-6">{children}</div>
    </main>
  );
}

export default async function FactionSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const faction = await getFaction(params.slug);
  if (!faction) return notFound();

  return (
    <Shell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{faction.name}</h1>
        <div className="text-amber-300">
          {[faction.alignment, faction.timeActive]
            .filter(Boolean)
            .join(" • ") || "—"}
        </div>
        <div className="text-sm text-amber-200/80">
          {faction.leader ? `Leader: ${faction.leader}` : "—"}
        </div>
      </div>

      {faction.purpose ? (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Purpose</h2>
          <p className="text-amber-200/90 whitespace-pre-wrap">
            {faction.purpose}
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Description</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {faction.description || "No description yet."}
        </p>
      </div>

      {!!faction.primaryMembers?.length && (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Members</h2>
          <ul className="list-disc list-inside text-amber-200/90 space-y-1">
            {faction.primaryMembers.map((m) => (
              <li key={m.slug}>
                <Link
                  className="underline hover:text-amber-200"
                  href={`/characters/${m.slug}`}
                >
                  {m.name}
                </Link>{" "}
                <span className="text-amber-200/70">
                  {[m.callsign, m.role].filter(Boolean).join(" — ") || ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!faction.ships?.length && (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Ships</h2>
          <ul className="list-disc list-inside text-amber-200/90 space-y-1">
            {faction.ships.map((s) => (
              <li key={s.slug}>
                <Link
                  className="underline hover:text-amber-200"
                  href={`/ships/${s.slug}`}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Link className="underline hover:text-amber-200" href="/factions">
          ← Back to Factions
        </Link>
      </div>
    </Shell>
  );
}
