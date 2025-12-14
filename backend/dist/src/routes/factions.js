"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = factionsRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function factionsRoutes(fastify) {
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
        const { slug } = request.params;
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
