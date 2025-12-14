import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Technology = {
  id: number;
  slug: string;
  name: string;
  originSpecies?: string | null;
  status?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags?: { id: number; name: string }[];
};

async function getTech(slug: string): Promise<Technology | null> {
  const res = await fetch(`${API}/api/technology/slug/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function TechnologySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tech = await getTech(slug);
  if (!tech) return notFound();

  return (
    <PageShell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{tech.name}</h1>
        <div className="text-amber-300">
          {[tech.originSpecies, tech.status].filter(Boolean).join(" • ") || "—"}
        </div>
      </div>

      {tech.imageUrl ? (
        <div className="relative w-full max-h-[420px] aspect-[16/9] rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-amber-400/10">
          <Image
            src={tech.imageUrl}
            alt={tech.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Description</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {tech.description || "No description yet."}
        </p>
      </div>

      <div>
        <Link className="underline hover:text-amber-200" href="/technology">
          ← Back to Technology
        </Link>
      </div>
    </PageShell>
  );
}
