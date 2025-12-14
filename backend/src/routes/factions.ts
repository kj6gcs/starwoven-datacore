import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function factionsRoutes(fastify: FastifyInstance) {
  fastify.get("/api/factions", async () => {
    return prisma.faction.findMany({
      orderBy: { name: "asc" },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });
  });

  fastify.get("/api/factions/slug/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const faction = await prisma.faction.findUnique({
      where: { slug },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    if (!faction) {
      reply.code(404);
      return { message: "Faction not found" };
    }

    return faction;
  });
}
