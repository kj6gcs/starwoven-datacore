export const dynamic = "force-dynamic";

import Image from "next/image";

type Character = {
  id: number;
  slug: string;
  name: string;
  callsign?: string | null;
  role?: string | null;
  species?: string | null;
  homeworld?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

async function getCharacters(): Promise<Character[]> {
  const res = await fetch("http://localhost:4000/api/characters", {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch characters");
    return [];
  }

  return res.json();
}

export default async function Home() {
  const characters = await getCharacters();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-2 tracking-wide">
        Starwoven Datacore
      </h1>
      <p className="mb-8 text-slate-300">
        Unified registry for characters in the Starwoven universe.
      </p>

      <section className="w-full max-w-5xl space-y-4">
        {characters.length === 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-6 text-center">
            <p className="text-slate-400">
              No characters in the Datacore yet. Add one via a POST to
              <code className="ml-1 text-amber-300 text-sm">
                /api/characters
              </code>
              .
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {characters.map((c) => (
            <article
              key={c.id}
              className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-lg flex flex-col md:flex-row gap-4"
            >
              {/* Image block */}
              {c.imageUrl && (
                <div className="relative w-full md:w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700">
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold">
                  {c.name}
                  {c.callsign && (
                    <span className="ml-2 text-amber-300 text-lg">
                      “{c.callsign}”
                    </span>
                  )}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  slug: {c.slug} • priority: {c.priority}
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  {c.role && <span className="mr-3">Role: {c.role}</span>}
                  {c.species && (
                    <span className="mr-3">Species: {c.species}</span>
                  )}
                  {c.homeworld && <span>Homeworld: {c.homeworld}</span>}
                </p>

                {c.bio && (
                  <p className="mt-3 text-slate-200 leading-relaxed">{c.bio}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
