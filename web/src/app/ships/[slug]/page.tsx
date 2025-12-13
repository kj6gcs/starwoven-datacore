import { notFound } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Ship = {
  id: number;
  slug: string;
  name: string;
  nickname?: string | null;
  registry?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  type?: string | null;
  yearBuilt?: number | null;
  specs?: string | null;
  history?: string | null;
  imageUrl?: string | null;
  tags?: { id: number; name: string }[];
  primaryCrew?: {
    slug: string;
    name: string;
    callsign?: string | null;
    role?: string | null;
    primaryFaction?: { slug: string; name: string } | null;
  }[];
};

async function getShip(slug: string): Promise<Ship | null> {
  const res = await fetch(`${API}/api/ships/slug/${slug}`, {
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

export default async function ShipSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const ship = await getShip(params.slug);
  if (!ship) return notFound();

  return (
    <Shell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{ship.name}</h1>
        <div className="text-amber-300">
          {[ship.nickname, ship.type].filter(Boolean).join(" — ") || "—"}
        </div>
        <div className="text-sm text-amber-200/80">
          {[
            ship.registry,
            ship.manufacturer,
            ship.model,
            ship.yearBuilt ? `Built: ${ship.yearBuilt}` : null,
          ]
            .filter(Boolean)
            .join(" • ") || "—"}
        </div>
      </div>

      {!!ship.primaryCrew?.length && (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Crew</h2>
          <ul className="list-disc list-inside text-amber-200/90 space-y-1">
            {ship.primaryCrew.map((c) => (
              <li key={c.slug}>
                <Link
                  className="underline hover:text-amber-200"
                  href={`/characters/${c.slug}`}
                >
                  {c.name}
                </Link>{" "}
                <span className="text-amber-200/70">
                  {[c.callsign, c.role].filter(Boolean).join(" — ") || ""}
                </span>
                {c.primaryFaction ? (
                  <>
                    {" "}
                    <span className="text-amber-200/70">•</span>{" "}
                    <Link
                      className="underline hover:text-amber-200"
                      href={`/factions/${c.primaryFaction.slug}`}
                    >
                      {c.primaryFaction.name}
                    </Link>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Specs</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {ship.specs || "No specs yet."}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">History</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {ship.history || "No history yet."}
        </p>
      </div>

      <div>
        <Link className="underline hover:text-amber-200" href="/ships">
          ← Back to Ships
        </Link>
      </div>
    </Shell>
  );
}
