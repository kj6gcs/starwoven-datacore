import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

import charactersRoutes from "./routes/characters";
import shipsRoutes from "./routes/ships";
import factionsRoutes from "./routes/factions";
import episodesRoutes from "./routes/episodes";
import locationsRoutes from "./routes/locations";
import technologyRoutes from "./routes/technology";
import loreRoutes from "./routes/lore";

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
  await fastify.register(episodesRoutes);
  await fastify.register(locationsRoutes);
  await fastify.register(technologyRoutes);
  await fastify.register(loreRoutes);

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
