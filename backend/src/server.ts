import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import cors from "@fastify/cors";
import { prisma } from "./prisma";

const fastify: FastifyInstance = Fastify({
  logger: true,
});

async function buildServer() {
  // Allow requests from Next.js dev server
  await fastify.register(cors, {
    origin: ["http://localhost:3000"],
  });

  // Health check
  fastify.get("/health", async () => {
    return { status: "ok", service: "starwoven-datacore-backend" };
  });

  // ==============================
  // CHARACTERS
  // ==============================

  // GET all characters
  fastify.get("/api/characters", async () => {
    const characters = await prisma.character.findMany({
      orderBy: { name: "asc" },
    });
    return characters;
  });

  // GET character by numeric id
  fastify.get(
    "/api/characters/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as { id: string };
      const id = Number(params.id);

      if (Number.isNaN(id)) {
        reply.code(400);
        return { error: "Invalid character id" };
      }

      const character = await prisma.character.findUnique({ where: { id } });

      if (!character) {
        reply.code(404);
        return { error: "Character not found" };
      }

      return character;
    }
  );

  // GET character by slug
  fastify.get(
    "/api/characters/slug/:slug",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as { slug: string };
      const { slug } = params;

      const character = await prisma.character.findUnique({ where: { slug } });

      if (!character) {
        reply.code(404);
        return { error: "Character not found" };
      }

      return character;
    }
  );

  // POST create character
  fastify.post(
    "/api/characters",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as {
        slug: string;
        name: string;
        callsign?: string;
        role?: string;
        species?: string;
        homeworld?: string;
        bio?: string;
        imageUrl?: string;
        priority?: number;
      };

      if (!body.slug || !body.name) {
        reply.code(400);
        return { error: "slug and name are required" };
      }

      try {
        const character = await prisma.character.create({
          data: {
            slug: body.slug,
            name: body.name,
            callsign: body.callsign,
            role: body.role,
            species: body.species,
            homeworld: body.homeworld,
            bio: body.bio,
            imageUrl: body.imageUrl,
            priority: body.priority ?? 0,
          },
        });

        reply.code(201);
        return character;
      } catch (err) {
        fastify.log.error(err);
        reply.code(500);
        return { error: "Failed to create character" };
      }
    }
  );

  // PUT update character
  fastify.put(
    "/api/characters/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as { id: string };
      const id = Number(params.id);

      if (Number.isNaN(id)) {
        reply.code(400);
        return { error: "Invalid character id" };
      }

      const body = request.body as {
        slug?: string;
        name?: string;
        callsign?: string;
        role?: string;
        species?: string;
        homeworld?: string;
        bio?: string;
        imageUrl?: string;
        priority?: number;
      };

      const existing = await prisma.character.findUnique({ where: { id } });
      if (!existing) {
        reply.code(404);
        return { error: "Character not found" };
      }

      try {
        const updated = await prisma.character.update({
          where: { id },
          data: {
            slug: body.slug ?? existing.slug,
            name: body.name ?? existing.name,
            callsign: body.callsign ?? existing.callsign,
            role: body.role ?? existing.role,
            species: body.species ?? existing.species,
            homeworld: body.homeworld ?? existing.homeworld,
            bio: body.bio ?? existing.bio,
            imageUrl: body.imageUrl ?? existing.imageUrl,
            priority: body.priority ?? existing.priority,
          },
        });

        return updated;
      } catch (err) {
        fastify.log.error(err);
        reply.code(500);
        return { error: "Failed to update character" };
      }
    }
  );

  // DELETE character
  fastify.delete(
    "/api/characters/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as { id: string };
      const id = Number(params.id);

      if (Number.isNaN(id)) {
        reply.code(400);
        return { error: "Invalid character id" };
      }

      try {
        await prisma.character.delete({ where: { id } });
        reply.code(204);
        return null;
      } catch (err) {
        fastify.log.error(err);
        reply.code(500);
        return { error: "Failed to delete character" };
      }
    }
  );

  return fastify;
}

async function start() {
  const app = await buildServer();
  try {
    await app.listen({ port: 4000, host: "0.0.0.0" });
    console.log("🚀 Fastify server running at http://localhost:4000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
