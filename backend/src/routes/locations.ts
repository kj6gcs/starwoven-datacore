import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function locationsRoutes(fastify: FastifyInstance) {
  // GET /api/locations (list)
  fastify.get("/api/locations", async () => {
    return prisma.location.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        where: true,
        dominantSpecies: true,
        primaryLanguage: true,
        imageUrl: true,
      },
    });
  });

  // GET /api/locations/slug/:slug (detail)
  fastify.get<{ Params: { slug: string } }>(
    "/api/locations/slug/:slug",
    async (request, reply) => {
      const loc = await prisma.location.findUnique({
        where: { slug: request.params.slug },
        include: { tags: true },
      });

      if (!loc) return reply.code(404).send({ message: "Location not found" });
      return loc;
    }
  );
}
