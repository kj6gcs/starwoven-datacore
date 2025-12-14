import Image from "next/image";
import Link from "next/link";

/* =========================
   Types
========================= */

type Character = {
  id: number;
  slug: string;
  name: string;
  callsign?: string | null;
  role?: string | null;
  imageUrl?: string | null;
  priority: number;
  primaryShip?: { slug: string; name: string } | null;
  primaryFaction?: { slug: string; name: string } | null;
};

type Ship = {
  id: number;
  slug: string;
  name: string;
  nickname?: string | null;
  type?: string | null;
  imageUrl?: string | null;
};

type Faction = {
  id: number;
  slug: string;
  name: string;
  alignment?: string | null;
  leader?: string | null;
  imageUrl?: string | null;
};

/* =========================
   API Base
========================= */

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/* =========================
   Data Fetchers
========================= */

async function getCharacters(): Promise<Character[]> {
  const res = await fetch(`${API}/api/characters`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getShips(): Promise<Ship[]> {
  const res = await fetch(`${API}/api/ships`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getFactions(): Promise<Faction[]> {
  const res = await fetch(`${API}/api/factions`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/* =========================
   UI Helpers
========================= */

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-4 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/30 transition">
      {children}
    </div>
  );
}

/* =========================
   Page
========================= */

export default async function Home() {
  const [characters, ships, factions] = await Promise.all([
    getCharacters(),
    getShips(),
    getFactions(),
  ]);

  const featuredCharacters = [...characters]
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
    .slice(0, 6);

  const featuredShips = ships.slice(0, 4);
  const featuredFactions = factions.slice(0, 4);

  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* =========================
           HERO
        ========================= */}
        <section className="text-center space-y-6">
          <Image
            src="/images/mainBanner.png"
            alt="Starwoven Data Core Banner"
            width={1200}
            height={400}
            className="mx-auto -mt-22"
            priority
          />

          <p className="text-xl text-amber-400 -mt-22">
            Explore the people, ships, technologies, and factions of the
            Starwoven universe.
          </p>

          <Image
            src="/images/default.png"
            alt="Starwoven — The Crew of the Constellation"
            width={6400}
            height={6400}
            className="mx-auto w-full max-w-[800px] h-auto rounded-2xl shadow-xl shadow-amber-400/75 -mt-4"
          />
        </section>

        {/* =========================
           QUICK LINKS
        ========================= */}
        <section className="grid gap-4 sm:grid-cols-3">
          <Link href="/characters">
            <CardShell>
              <div className="text-2xl font-bold">Characters</div>
              <div className="text-amber-300 mt-1">
                Bios, roles, ships, and factions
              </div>
              <div className="text-sm text-amber-200/80 mt-3">
                {characters.length} total
              </div>
            </CardShell>
          </Link>

          <Link href="/ships">
            <CardShell>
              <div className="text-2xl font-bold">Ships</div>
              <div className="text-amber-300 mt-1">
                Vessels, registries, and crews
              </div>
              <div className="text-sm text-amber-200/80 mt-3">
                {ships.length} total
              </div>
            </CardShell>
          </Link>

          <Link href="/factions">
            <CardShell>
              <div className="text-2xl font-bold">Factions</div>
              <div className="text-amber-300 mt-1">
                Allegiances and power structures
              </div>
              <div className="text-sm text-amber-200/80 mt-3">
                {factions.length} total
              </div>
            </CardShell>
          </Link>
        </section>

        {/* =========================
           FEATURED CHARACTERS
        ========================= */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold">Featured Characters</h2>
            <Link
              href="/characters"
              className="text-amber-300 hover:text-amber-200 underline"
            >
              View all
            </Link>
          </div>

          {featuredCharacters.length === 0 ? (
            <CardShell>No characters yet.</CardShell>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCharacters.map((c) => (
                <Link key={c.slug} href={`/characters/${c.slug}`}>
                  <CardShell>
                    <div className="text-xl font-bold">{c.name}</div>
                    <div className="text-amber-300">
                      {[c.callsign, c.role].filter(Boolean).join(" — ") || "—"}
                    </div>

                    <div className="text-sm text-amber-200/80 mt-3 space-y-1">
                      <div>Ship: {c.primaryShip?.name ?? "—"}</div>
                      <div>Faction: {c.primaryFaction?.name ?? "—"}</div>
                    </div>
                  </CardShell>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =========================
           SHIPS & FACTIONS
        ========================= */}
        <section className="grid gap-8 lg:grid-cols-2">
          {/* Ships */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ships</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredShips.map((s) => (
                <Link key={s.slug} href={`/ships/${s.slug}`}>
                  <CardShell>
                    <div className="text-xl font-bold">{s.name}</div>
                    <div className="text-amber-300">
                      {[s.nickname, s.type].filter(Boolean).join(" — ") || "—"}
                    </div>
                  </CardShell>
                </Link>
              ))}
            </div>
          </div>

          {/* Factions */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Factions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredFactions.map((f) => (
                <Link key={f.slug} href={`/factions/${f.slug}`}>
                  <CardShell>
                    <div className="text-xl font-bold">{f.name}</div>
                    <div className="text-amber-300">
                      {[f.alignment, f.leader && `Leader: ${f.leader}`]
                        .filter(Boolean)
                        .join(" • ") || "—"}
                    </div>
                  </CardShell>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
