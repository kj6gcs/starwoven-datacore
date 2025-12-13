import { notFound } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Episode = {
  id: number;
  slug: string;
  title: string;
  season: number;
  episode: number;
  discovery?: string | null;
  synopsis?: string | null;
  imageUrl?: string | null;
  tags?: { id: number; name: string }[];
  mainCast?: { slug: string; name: string }[];
};

async function getEpisode(slug: string): Promise<Episode | null> {
  const res = await fetch(`${API}/api/episodes/slug/${slug}`, {
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

export default async function EpisodeSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const ep = await getEpisode(params.slug);
  if (!ep) return notFound();

  return (
    <Shell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{ep.title}</h1>
        <div className="text-amber-300">
          Season {ep.season} • Episode {ep.episode}
        </div>
        <div className="text-sm text-amber-200/80">{ep.discovery || "—"}</div>
      </div>

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {ep.synopsis || "No synopsis yet."}
        </p>
      </div>

      {!!ep.mainCast?.length && (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Main Cast</h2>
          <ul className="list-disc list-inside text-amber-200/90 space-y-1">
            {ep.mainCast.map((c) => (
              <li key={c.slug}>
                <Link
                  className="underline hover:text-amber-200"
                  href={`/characters/${c.slug}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Link className="underline hover:text-amber-200" href="/episodes">
          ← Back to Episodes
        </Link>
      </div>
    </Shell>
  );
}
