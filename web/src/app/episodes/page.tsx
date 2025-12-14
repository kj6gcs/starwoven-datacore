import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Episode = {
  id: number;
  slug: string;
  title: string;
  season: number;
  episode: number;
  discovery?: string | null;
  imageUrl?: string | null;
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
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Episodes</h1>
          <p className="text-amber-300">{sorted.length} total</p>
        </div>

        {/* Empty state */}
        {sorted.length === 0 ? (
          <Card>
            <div className="text-amber-300">No episodes yet.</div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((e) => (
              <Link key={e.slug} href={`/episodes/${e.slug}`}>
                <Card>
                  {/* Thumbnail */}
                  {e.imageUrl ? (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-amber-400/30 mb-3">
                      <Image
                        src={e.imageUrl}
                        alt={e.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    // Optional placeholder keeps card height consistent
                    <div className="w-full aspect-[16/9] rounded-xl bg-stone-800/40 border border-amber-400/20 mb-3 flex items-center justify-center text-amber-200/40 text-sm">
                      No Image
                    </div>
                  )}

                  {/* Text content */}
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
