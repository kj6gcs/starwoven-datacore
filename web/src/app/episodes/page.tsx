import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Episode = {
  id: number;
  slug: string;
  title: string;
  season: number;
  episode: number;
  discovery?: string | null;
};

async function getEpisodes(): Promise<Episode[]> {
  const res = await fetch(`${API}/api/episodes`, { cache: "no-store" });
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

export default async function EpisodesPage() {
  const episodes = await getEpisodes();

  const sorted = [...episodes].sort(
    (a, b) => a.season - b.season || a.episode - b.episode
  );

  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Episodes</h1>
          <p className="text-amber-300">{sorted.length} total</p>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <div className="text-amber-300">No episodes yet.</div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((e) => (
              <Link key={e.slug} href={`/episodes/${e.slug}`}>
                <Card>
                  <div className="text-xl font-bold">{e.title}</div>
                  <div className="text-amber-300">
                    Season {e.season} • Episode {e.episode}
                  </div>
                  <div className="text-sm text-amber-200/80 mt-3">
                    {e.discovery || "—"}
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
