import Link from "next/link";

type Character = {
  slug: string;
  name: string;
  callsign?: string | null;
  role?: string | null;
  primaryShip?: { slug: string; name: string } | null;
  primaryFaction?: { slug: string; name: string } | null;
};

type Ship = { slug: string; name: string; type?: string | null };
type Faction = { slug: string; name: string; alignment?: string | null };

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function includesQ(value: string | null | undefined, q: string) {
  return (value ?? "").toLowerCase().includes(q);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const qRaw = (searchParams.q ?? "").trim();
  const q = qRaw.toLowerCase();

  if (!qRaw) {
    return (
      <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-amber-300 mt-2">
            Type something in the navbar search box.
          </p>
        </div>
      </main>
    );
  }

  const [characters, ships, factions] = await Promise.all([
    fetch(`${API}/api/characters`, { cache: "no-store" }).then(
      (r) => r.json() as Promise<Character[]>
    ),
    fetch(`${API}/api/ships`, { cache: "no-store" }).then(
      (r) => r.json() as Promise<Ship[]>
    ),
    fetch(`${API}/api/factions`, { cache: "no-store" }).then(
      (r) => r.json() as Promise<Faction[]>
    ),
  ]);

  const characterHits = characters.filter(
    (c) =>
      includesQ(c.name, q) ||
      includesQ(c.callsign ?? "", q) ||
      includesQ(c.role ?? "", q) ||
      includesQ(c.primaryShip?.name ?? "", q) ||
      includesQ(c.primaryFaction?.name ?? "", q)
  );

  const shipHits = ships.filter(
    (s) => includesQ(s.name, q) || includesQ(s.type ?? "", q)
  );

  const factionHits = factions.filter(
    (f) => includesQ(f.name, q) || includesQ(f.alignment ?? "", q)
  );

  const total = characterHits.length + shipHits.length + factionHits.length;

  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-amber-300 mt-2">
            Showing {total} result{total === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-amber-400">“{qRaw}”</span>
          </p>
        </div>

        {characterHits.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Characters</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {characterHits.map((c) => (
                <Link
                  key={c.slug}
                  href={`/characters/${c.slug}`}
                  className="block rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-4 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/30 transition"
                >
                  <div className="text-xl font-bold">{c.name}</div>
                  <div className="text-amber-300">
                    {[c.callsign, c.role].filter(Boolean).join(" — ")}
                  </div>
                  <div className="text-sm text-amber-200/80 mt-2">
                    {c.primaryShip?.name
                      ? `Ship: ${c.primaryShip.name}`
                      : "Ship: —"}{" "}
                    •{" "}
                    {c.primaryFaction?.name
                      ? `Faction: ${c.primaryFaction.name}`
                      : "Faction: —"}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {shipHits.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Ships</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {shipHits.map((s) => (
                <Link
                  key={s.slug}
                  href={`/ships/${s.slug}`}
                  className="block rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-4 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/30 transition"
                >
                  <div className="text-xl font-bold">{s.name}</div>
                  <div className="text-amber-300">{s.type ?? "—"}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {factionHits.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Factions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {factionHits.map((f) => (
                <Link
                  key={f.slug}
                  href={`/factions/${f.slug}`}
                  className="block rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-4 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/30 transition"
                >
                  <div className="text-xl font-bold">{f.name}</div>
                  <div className="text-amber-300">{f.alignment ?? "—"}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {total === 0 && (
          <div className="rounded-2xl border border-amber-400/30 bg-stone-800/40 p-6">
            No matches found. Try searching by name, callsign, ship, or faction.
          </div>
        )}
      </div>
    </main>
  );
}
