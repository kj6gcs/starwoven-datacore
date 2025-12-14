import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/* =========================
   Types
========================= */

type Location = {
  id: number;
  slug: string;
  name: string;
  where?: string | null;
  dominantSpecies?: string | null;
  primaryLanguage?: string | null;
  overview?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags?: { id: number; name: string }[];
};

/* =========================
   Data Fetch
========================= */

async function getLocation(slug: string): Promise<Location | null> {
  const res = await fetch(`${API}/api/locations/slug/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

/* =========================
   Page
========================= */

export default async function LocationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const location = await getLocation(slug);
  if (!location) return notFound();

  return (
    <PageShell>
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{location.name}</h1>

        <div className="text-amber-300">
          {[location.where, location.dominantSpecies]
            .filter(Boolean)
            .join(" • ") || "—"}
        </div>

        <div className="text-sm text-amber-200/80">
          {location.primaryLanguage
            ? `Primary Language: ${location.primaryLanguage}`
            : "—"}
        </div>
      </div>

      {location.imageUrl ? (
        <div className="relative w-full max-h-[420px] aspect-[16/9] rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-amber-400/10">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      {/* Overview */}
      {location.overview ? (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
          <h2 className="text-2xl font-bold mb-3">Overview</h2>
          <p className="text-amber-200/90 whitespace-pre-wrap">
            {location.overview}
          </p>
        </div>
      ) : null}

      {/* Description */}
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Description</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {location.description || "No description yet."}
        </p>
      </div>

      {/* Tags */}
      {location.tags?.length ? (
        <div className="text-sm text-amber-200/70">
          Tags: {location.tags.map((t) => t.name).join(", ")}
        </div>
      ) : null}

      {/* Back link */}
      <div>
        <Link href="/locations" className="underline hover:text-amber-200">
          ← Back to Locations
        </Link>
      </div>
    </PageShell>
  );
}
