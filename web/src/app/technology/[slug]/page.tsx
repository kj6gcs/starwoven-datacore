import { notFound } from "next/navigation";
import Link from "next/link";

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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-4xl mx-auto space-y-6">{children}</div>
    </main>
  );
}

export default async function TechnologySlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const tech = await getTech(params.slug);
  if (!tech) return notFound();

  return (
    <Shell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{tech.name}</h1>
        <div className="text-amber-300">
          {[tech.originSpecies, tech.status].filter(Boolean).join(" • ") || "—"}
        </div>
      </div>

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
    </Shell>
  );
}
