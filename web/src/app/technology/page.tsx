import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Technology = {
  id: number;
  slug: string;
  name: string;
  originSpecies?: string | null;
  status?: string | null;
};

async function getTechnology(): Promise<Technology[]> {
  const res = await fetch(`${API}/api/technology`, { cache: "no-store" });
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

export default async function TechnologyPage() {
  const tech = await getTechnology();
  const sorted = [...tech].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold">Technology</h1>
          <p className="text-amber-300">{sorted.length} total</p>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <div className="text-amber-300">No technology entries yet.</div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((t) => (
              <Link key={t.slug} href={`/technology/${t.slug}`}>
                <Card>
                  <div className="text-xl font-bold">{t.name}</div>
                  <div className="text-amber-300">
                    {[t.originSpecies, t.status].filter(Boolean).join(" • ") ||
                      "—"}
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
