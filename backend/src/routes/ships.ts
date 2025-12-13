import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../prisma";

export const shipsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET all ships (optional but handy)
  fastify.get("/api/ships", async () => {
    return prisma.ship.findMany({
      orderBy: [{ name: "asc" }],
      include: { tags: true },
    });
  });

  // GET ship by slug (includes primary crew + tags)
  fastify.get("/api/ships/slug/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const ship = await prisma.ship.findUnique({
      where: { slug },
      include: {
        primaryCrew: {
          orderBy: [{ priority: "desc" }, { name: "asc" }],
          select: {
            slug: true,
            name: true,
            callsign: true,
            role: true,
            primaryFaction: { select: { slug: true, name: true } },
          },
        },
        tags: true,
      },
    });

    if (!ship) {
      reply.code(404);
      return { error: "Ship not found" };
    }

    return ship;
  });
};
