import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function loreRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/lore
   * List view for cards
   */
  fastify.get("/api/lore", async () => {
    return prisma.lore.findMany({
      orderBy: [{ title: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        era: true,
        imageUrl: true,
      },
    });
  });

  /**
   * GET /api/lore/slug/:slug
   * Detail view
   */
  fastify.get<{ Params: { slug: string } }>(
    "/api/lore/slug/:slug",
    async (request, reply) => {
      const lore = await prisma.lore.findUnique({
        where: { slug: request.params.slug },
        include: { tags: true },
      });

      if (!lore) {
        return reply.code(404).send({ message: "Lore entry not found" });
      }

      return lore;
    }
  );
}
