import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Lore = {
  id: number;
  slug: string;
  title: string;
  era?: string | null;
  content?: string | null; // <-- if your schema uses "body" or "text", rename here + backend include/select
  imageUrl?: string | null;
  tags?: { id: number; name: string }[];
};

async function getLoreBySlug(slug: string): Promise<Lore | null> {
  try {
    const url = `${API}/api/lore/slug/${slug}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Lore fetch failed:", res.status, url);
      console.error("Body:", await res.text());
      return null;
    }

    return res.json();
  } catch (e) {
    console.error("Lore fetch threw:", e);
    return null;
  }
}

export default async function LoreSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lore = await getLoreBySlug(slug);
  if (!lore) return notFound();

  return (
    <PageShell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{lore.title}</h1>
        <div className="text-amber-300">{lore.era || "—"}</div>

        {lore.tags?.length ? (
          <div className="text-sm text-amber-200/80">
            Tags: {lore.tags.map((t) => t.name).join(", ")}
          </div>
        ) : null}
      </div>

      {lore.imageUrl ? (
        <div className="relative w-full max-h-[420px] aspect-[16/9] rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-amber-400/10">
          <Image
            src={lore.imageUrl}
            alt={lore.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Entry</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {lore.content || "No entry text yet."}
        </p>
      </div>

      <div>
        <Link className="underline hover:text-amber-200" href="/lore">
          ← Back to Lore
        </Link>
      </div>
    </PageShell>
  );
}
