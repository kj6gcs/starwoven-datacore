import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---- Tags (optional but nice) ----
  const [tagCrew, tagShip, tagFaction] = await Promise.all([
    prisma.tag.upsert({
      where: { name: "crew" },
      update: {},
      create: { name: "crew" },
    }),
    prisma.tag.upsert({
      where: { name: "ship" },
      update: {},
      create: { name: "ship" },
    }),
    prisma.tag.upsert({
      where: { name: "faction" },
      update: {},
      create: { name: "faction" },
    }),
  ]);

  // ---- Ships ----
  const constellation = await prisma.ship.upsert({
    where: { slug: "the-constellation" },
    update: {
      name: "The Constellation",
      type: "Corvette-class",
      tags: { set: [{ id: tagShip.id }] },
    },
    create: {
      slug: "the-constellation",
      name: "The Constellation",
      nickname: "Constellation",
      registry: "ISV-31835",
      manufacturer: "Zenith Archforge Shipworks",
      model: "ISV Platform",
      type: "Corvette-class",
      yearBuilt: 22107,
      tags: { connect: [{ id: tagShip.id }] },
    },
  });

  // ---- Factions ----
  const veil = await prisma.faction.upsert({
    where: { slug: "veil" },
    update: {
      name: "V.E.I.L.",
      alignment: "Accord-aligned",
      tags: { set: [{ id: tagFaction.id }] },
    },
    create: {
      slug: "veil",
      name: "V.E.I.L.",
      alignment: "Accord-aligned",
      purpose: "Voidborne Espionage & Infiltration Legion",
      description:
        "Elite special forces unit specializing in covert operations, infiltration, and deep-space espionage.",
      tags: { connect: [{ id: tagFaction.id }] },
    },
  });

  const specters = await prisma.faction.upsert({
    where: { slug: "specters-of-the-rift" },
    update: {
      name: "Specters of the Rift",
      alignment: "Hostile",
      tags: { set: [{ id: tagFaction.id }] },
    },
    create: {
      slug: "specters-of-the-rift",
      name: "Specters of the Rift",
      alignment: "Hostile",
      purpose: "Rift-cult raiders seeking Arcwave-related tech",
      description:
        "A ruthless faction that believes in their divine right to control Arcwave secrets and the mythical Threadspace it unlocks.",
      tags: { connect: [{ id: tagFaction.id }] },
    },
  });

  // ---- Characters ----
  const cross = await prisma.character.upsert({
    where: { slug: "gavin-cross" },
    update: {
      name: "Gavin Cross",
      callsign: "Cross",
      role: "Captain",
      species: "Human",
      homeworld: "Mars",
      bio: "Former VEIL operative and captain of the Constellation.",
      priority: 100,
      primaryShipId: constellation.id,
      primaryFactionId: veil.id,
      tags: { set: [{ id: tagCrew.id }] },
      ships: { set: [{ id: constellation.id }] },
      factions: { set: [{ id: veil.id }] },
    },
    create: {
      slug: "gavin-cross",
      name: "Gavin Cross",
      callsign: "Cross",
      role: "Captain",
      species: "Human",
      homeworld: "Mars",
      bio: "Former VEIL operative and captain of the Constellation.",
      priority: 100,
      primaryShipId: constellation.id,
      primaryFactionId: veil.id,
      tags: { connect: [{ id: tagCrew.id }] },
      ships: { connect: [{ id: constellation.id }] },
      factions: { connect: [{ id: veil.id }] },
    },
  });

  const sora = await prisma.character.upsert({
    where: { slug: "sora-caddell" },
    update: {
      name: "Sora Caddell",
      role: "XO",
      species: "Human (Veltheri-descended)",
      homeworld: "Veltheris",
      bio: "A survivor of the Celestial Queen incident, now aboard the Constellation.",
      priority: 90,
      primaryShipId: constellation.id,
      primaryFactionId: veil.id,
      tags: { set: [{ id: tagCrew.id }] },
      ships: { set: [{ id: constellation.id }] },
      factions: { set: [{ id: veil.id }] },
    },
    create: {
      slug: "sora-caddell",
      name: "Sora Caddell",
      role: "XO",
      species: "Human (Veltheri-descended)",
      homeworld: "Veltheris",
      bio: "A survivor of the Celestial Queen incident, now aboard the Constellation.",
      priority: 90,
      primaryShipId: constellation.id,
      primaryFactionId: veil.id,
      tags: { connect: [{ id: tagCrew.id }] },
      ships: { connect: [{ id: constellation.id }] },
      factions: { connect: [{ id: veil.id }] },
    },
  });

  const rosko = await prisma.character.upsert({
    where: { slug: "levi-rosko-roskins" },
    update: {
      name: 'Levi "Rosko" Roskins',
      role: "Security / Combat",
      species: "Human",
      homeworld: "Mars",
      bio: "A grounded, reliable combatant with a southern-inspired edge.",
      priority: 80,
      primaryShipId: constellation.id,
      primaryFactionId: veil.id,
      tags: { set: [{ id: tagCrew.id }] },
      ships: { set: [{ id: constellation.id }] },
      factions: { set: [{ id: veil.id }] },
    },
    create: {
      slug: "levi-rosko-roskins",
      name: 'Levi "Rosko" Roskins',
      role: "Security / Combat",
      species: "Human",
      homeworld: "Mars",
      bio: "A grounded, reliable combatant with a southern-inspired edge.",
      priority: 80,
      primaryShipId: constellation.id,
      primaryFactionId: veil.id,
      tags: { connect: [{ id: tagCrew.id }] },
      ships: { connect: [{ id: constellation.id }] },
      factions: { connect: [{ id: veil.id }] },
    },
  });

  console.log("✅ Seed complete:", {
    ship: constellation.slug,
    factions: [veil.slug, specters.slug],
    characters: [cross.slug, sora.slug, rosko.slug],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
