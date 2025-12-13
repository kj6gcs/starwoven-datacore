import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../prisma";

export const charactersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/api/characters", async () => {
    return prisma.character.findMany({
      orderBy: [{ priority: "desc" }, { name: "asc" }],
      include: {
        primaryShip: { select: { slug: true, name: true } },
        primaryFaction: { select: { slug: true, name: true } },
        tags: true,
      },
    });
  });

  fastify.get("/api/characters/slug/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const character = await prisma.character.findUnique({
      where: { slug },
      include: {
        primaryShip: { select: { slug: true, name: true } },
        primaryFaction: { select: { slug: true, name: true } },
        tags: true,
      },
    });

    if (!character) {
      reply.code(404);
      return { error: "Character not found" };
    }

    return character;
  });
};
