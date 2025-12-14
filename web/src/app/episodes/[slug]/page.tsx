import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Image from "next/image";

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

export default async function EpisodeSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const episode = await getEpisode(slug);
  if (!episode) return notFound();

  return (
    <PageShell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{episode.title}</h1>
        <div className="text-amber-300">
          Season {episode.season} • Episode {episode.episode}
        </div>
        <div className="text-sm text-amber-200/80">
          {episode.discovery || "—"}
        </div>
      </div>

      {episode.imageUrl ? (
        <div className="relative w-full max-h-[420px] aspect-[16/9] rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-amber-400/10">
          <Image
            src={episode.imageUrl}
            alt={episode.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {episode.synopsis || "No synopsis yet."}
        </p>
      </div>

      {!!episode.mainCast?.length && (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Main Cast</h2>
          <ul className="list-disc list-inside text-amber-200/90 space-y-1">
            {episode.mainCast.map((c) => (
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
    </PageShell>
  );
}
