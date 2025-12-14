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
    origin: ["http://localhost:3000", "https://starwoven-datacore.vercel.app/"],
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
    const port = Number(process.env.PORT) || 4000;
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`🚀 Fastify server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
