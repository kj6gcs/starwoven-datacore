"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const characters_1 = __importDefault(require("./routes/characters"));
const ships_1 = __importDefault(require("./routes/ships"));
const factions_1 = __importDefault(require("./routes/factions"));
const episodes_1 = __importDefault(require("./routes/episodes"));
const locations_1 = __importDefault(require("./routes/locations"));
const technology_1 = __importDefault(require("./routes/technology"));
const lore_1 = __importDefault(require("./routes/lore"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
async function buildServer() {
    await fastify.register(cors_1.default, {
        origin: ["http://localhost:3000", "https://starwoven-datacore.vercel.app/"],
    });
    fastify.get("/health", async () => {
        return { status: "ok", service: "starwoven-datacore-backend" };
    });
    // Route modules (Fastify plugins)
    await fastify.register(characters_1.default);
    await fastify.register(ships_1.default);
    await fastify.register(factions_1.default);
    await fastify.register(episodes_1.default);
    await fastify.register(locations_1.default);
    await fastify.register(technology_1.default);
    await fastify.register(lore_1.default);
    return fastify;
}
async function start() {
    const app = await buildServer();
    try {
        const port = Number(process.env.PORT) || 4000;
        await app.listen({ port, host: "0.0.0.0" });
        app.log.info(`🚀 Fastify server running on port ${port}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();
