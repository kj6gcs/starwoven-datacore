import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import DossierCard from "@/components/DossierCard";
// not going to use this for now, but leaving it in pleace for future reference

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

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
  primaryShip?: { slug: string; name: string } | null;
  primaryFaction?: { slug: string; name: string } | null;
  tags?: { id: number; name: string }[];
};

async function getCharacter(slug: string): Promise<Character | null> {
  try {
    const url = `${API}/api/characters/slug/${slug}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Character fetch failed:", res.status, url);
      console.error("Body:", await res.text());
      return null;
    }

    return res.json();
  } catch (e) {
    console.error("Character fetch threw:", e);
    return null;
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-900 text-amber-400 p-10">
      <div className="max-w-4xl mx-auto space-y-6">{children}</div>
    </main>
  );
}

export default async function CharacterSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const character = await getCharacter(slug);
  if (!character) return notFound();

  return (
    <Shell>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{character.name}</h1>
        <div className="text-amber-300">
          {[character.callsign, character.role].filter(Boolean).join(" — ") ||
            "—"}
        </div>
        <div className="text-sm text-amber-200/80">
          {[character.species, character.homeworld]
            .filter(Boolean)
            .join(" • ") || "—"}
        </div>
      </div>

      {character.imageUrl ? (
        <div className="relative w-full max-h-[420px] aspect-[16/9] rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-amber-400/10">
          <Image
            src={character.imageUrl}
            alt={character.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Profile</h2>

        <div className="space-y-2 text-amber-200/90">
          <div>
            <span className="text-amber-400 font-semibold">Ship:</span>{" "}
            {character.primaryShip ? (
              <Link
                className="underline hover:text-amber-200"
                href={`/ships/${character.primaryShip.slug}`}
              >
                {character.primaryShip.name}
              </Link>
            ) : (
              "—"
            )}
          </div>

          <div>
            <span className="text-amber-400 font-semibold">Faction:</span>{" "}
            {character.primaryFaction ? (
              <Link
                className="underline hover:text-amber-200"
                href={`/factions/${character.primaryFaction.slug}`}
              >
                {character.primaryFaction.name}
              </Link>
            ) : (
              "—"
            )}
          </div>

          {character.tags?.length ? (
            <div>
              <span className="text-amber-400 font-semibold">Tags:</span>{" "}
              {character.tags.map((t) => t.name).join(", ")}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-stone-900 to-stone-800 p-5 shadow-xl shadow-amber-400/10">
        <h2 className="text-2xl font-bold mb-3">Biography</h2>
        <p className="text-amber-200/90 whitespace-pre-wrap">
          {character.bio || "No biography yet."}
        </p>
      </div>

      <div>
        <Link className="underline hover:text-amber-200" href="/characters">
          ← Back to Characters
        </Link>
      </div>
    </Shell>
  );
}
