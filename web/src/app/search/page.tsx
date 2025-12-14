import Link from "next/link";

type Tag = { id: number; name: string };

type Character = {
  slug: string;
  name: string;
  callsign?: string | null;
  role?: string | null;
  primaryShip?: { slug: string; name: string } | null;
  primaryFaction?: { slug: string; name: string } | null;
  tags?: Tag[];
};

type Ship = {
  slug: string;
  name: string;
  type?: string | null;
  tags?: Tag[];
};

type Faction = {
  slug: string;
  name: string;
  alignment?: string | null;
  tags?: Tag[];
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function includesQ(value: string | null | undefined, q: string) {
  return (value ?? "").toLowerCase().includes(q);
}

function includesTagQ(tags: Tag[] | undefined, q: string) {
  return tags?.some((t) => t.name.toLowerCase().includes(q)) ?? false;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const qValue = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const qRaw = (qValue ?? "").trim();
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
    fetch(`${API}/api/characters`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${API}/api/ships`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${API}/api/factions`, { cache: "no-store" }).then((r) => r.json()),
  ]);

  const characterHits = characters.filter(
    (c: Character) =>
      includesQ(c.name, q) ||
      includesQ(c.callsign, q) ||
      includesQ(c.role, q) ||
      includesQ(c.primaryShip?.name, q) ||
      includesQ(c.primaryFaction?.name, q) ||
      includesTagQ(c.tags, q)
  );

  const shipHits = ships.filter(
    (s: Ship) =>
      includesQ(s.name, q) || includesQ(s.type, q) || includesTagQ(s.tags, q)
  );

  const factionHits = factions.filter(
    (f: Faction) =>
      includesQ(f.name, q) ||
      includesQ(f.alignment, q) ||
      includesTagQ(f.tags, q)
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
          <section>
            <h2 className="text-2xl font-bold mb-3">Characters</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {characterHits.map((c: Character) => (
                <Link
                  key={c.slug}
                  href={`/characters/${c.slug}`}
                  className="card"
                >
                  <div className="text-xl font-bold">{c.name}</div>
                  <div className="text-amber-300">
                    {[c.callsign, c.role].filter(Boolean).join(" — ")}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {shipHits.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-3">Ships</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {shipHits.map((s: Ship) => (
                <Link key={s.slug} href={`/ships/${s.slug}`} className="card">
                  <div className="text-xl font-bold">{s.name}</div>
                  <div className="text-amber-300">{s.type ?? "—"}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {factionHits.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-3">Factions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {factionHits.map((f: Faction) => (
                <Link
                  key={f.slug}
                  href={`/factions/${f.slug}`}
                  className="card"
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
            No matches found.
          </div>
        )}
      </div>
    </main>
  );
}
