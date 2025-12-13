import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Character = {
  id: number;
  slug: string;
  name: string;
  callsign?: string | null;
  role?: string | null;
  species?: string | null;
  homeworld?: string | null;
  priority: number;
  primaryShip?: { slug: string; name: string } | null;
  primaryFaction?: { slug: string; name: string } | null;
};

async function getCharacters(): Promise<Character[]> {
  const res = await fetch(`${API}/api/characters`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-4 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/30 transition">
      {children}
    </div>
  );
}

export default async function CharactersPage() {
  const characters = await getCharacters();

  const sorted = [...characters].sort(
    (a, b) =>
      (b.priority ?? 0) - (a.priority ?? 0) || a.name.localeCompare(b.name)
  );

  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Characters</h1>
          <p className="text-amber-300">
            {sorted.length} total • Click a card to open the dossier.
          </p>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <div className="text-amber-300">
              No characters yet. Run your seed.
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((c) => (
              <Link key={c.slug} href={`/characters/${c.slug}`}>
                <Card>
                  <div className="text-xl font-bold">{c.name}</div>
                  <div className="text-amber-300">
                    {[c.callsign, c.role].filter(Boolean).join(" — ") || "—"}
                  </div>

                  <div className="text-sm text-amber-200/80 mt-3 space-y-1">
                    <div>
                      {[c.species, c.homeworld].filter(Boolean).join(" • ") ||
                        "—"}
                    </div>
                    <div>Ship: {c.primaryShip?.name ?? "—"}</div>
                    <div>Faction: {c.primaryFaction?.name ?? "—"}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
