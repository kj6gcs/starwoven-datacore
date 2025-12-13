import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../prisma";

export const factionsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET all factions (optional but handy)
  fastify.get("/api/factions", async () => {
    return prisma.faction.findMany({
      orderBy: [{ name: "asc" }],
      include: { tags: true },
    });
  });

  // GET faction by slug (includes primary members + ships + tags)
  fastify.get("/api/factions/slug/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const faction = await prisma.faction.findUnique({
      where: { slug },
      include: {
        primaryMembers: {
          orderBy: [{ priority: "desc" }, { name: "asc" }],
          select: {
            slug: true,
            name: true,
            callsign: true,
            role: true,
            primaryShip: { select: { slug: true, name: true } },
          },
        },
        ships: { select: { slug: true, name: true } },
        tags: true,
      },
    });

    if (!faction) {
      reply.code(404);
      return { error: "Faction not found" };
    }

    return faction;
  });
};
