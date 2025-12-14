import Link from "next/link";
import PageShell from "@/components/PageShell";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type Lore = {
  id: number;
  slug: string;
  title: string;
  era?: string | null;
  imageUrl?: string | null;
};

async function getLore(): Promise<Lore[]> {
  const res = await fetch(`${API}/api/lore`, { cache: "no-store" });
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

export default async function LorePage() {
  const items = await getLore();

  const sorted = [...items].sort((a, b) =>
    (a.title ?? "").localeCompare(b.title ?? "")
  );

  return (
    <PageShell>
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Lore</h1>
        <p className="text-amber-300">{sorted.length} total</p>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <div className="text-amber-300">No lore entries yet.</div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((l) => (
            <Link key={l.slug} href={`/lore/${l.slug}`}>
              <Card>
                {l.imageUrl ? (
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-amber-400/30 mb-3">
                    <Image
                      src={l.imageUrl}
                      alt={l.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[16/9] rounded-xl bg-stone-800/40 border border-amber-400/20 mb-3 flex items-center justify-center text-amber-200/40 text-sm">
                    No Image
                  </div>
                )}

                <div className="text-xl font-bold">{l.title}</div>
                <div className="text-amber-300">{l.era || "—"}</div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
