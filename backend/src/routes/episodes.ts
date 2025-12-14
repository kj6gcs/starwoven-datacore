import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function episodesRoutes(app: FastifyInstance) {
  // GET /api/episodes  (list)
  app.get("/api/episodes", async () => {
    const episodes = await prisma.episode.findMany({
      orderBy: [{ season: "asc" }, { episode: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        season: true,
        episode: true,
        discovery: true,
        imageUrl: true,
      },
    });

    return episodes;
  });

  // GET /api/episodes/slug/:slug  (detail)
  app.get<{ Params: { slug: string } }>(
    "/api/episodes/slug/:slug",
    async (req, reply) => {
      const episode = await prisma.episode.findUnique({
        where: { slug: req.params.slug },
        include: {
          tags: true,
          mainCast: {
            select: { slug: true, name: true },
          },
        },
      });

      if (!episode) {
        return reply.code(404).send({ message: "Episode not found" });
      }

      return episode;
    }
  );
}
