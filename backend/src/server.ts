import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

import { charactersRoutes } from "./routes/characters";
import { shipsRoutes } from "./routes/ships";
import { factionsRoutes } from "./routes/factions";

const fastify: FastifyInstance = Fastify({
  logger: true,
});

async function buildServer() {
  await fastify.register(cors, {
    origin: ["http://localhost:3000"],
  });

  fastify.get("/health", async () => {
    return { status: "ok", service: "starwoven-datacore-backend" };
  });

  // Route modules (Fastify plugins)
  await fastify.register(charactersRoutes);
  await fastify.register(shipsRoutes);
  await fastify.register(factionsRoutes);

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
