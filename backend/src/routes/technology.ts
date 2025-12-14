import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function technologyRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/technology
   * List view for cards
   */
  fastify.get("/api/technology", async () => {
    return prisma.technology.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        originSpecies: true,
        status: true,
        imageUrl: true,
      },
    });
  });

  /**
   * GET /api/technology/slug/:slug
   * Detail view for a single technology entry
   */
  fastify.get<{ Params: { slug: string } }>(
    "/api/technology/slug/:slug",
    async (request, reply) => {
      const tech = await prisma.technology.findUnique({
        where: { slug: request.params.slug },
        include: { tags: true },
      });

      if (!tech) {
        return reply.code(404).send({ message: "Technology not found" });
      }

      return tech;
    }
  );
}
