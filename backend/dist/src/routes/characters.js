"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = charactersRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function charactersRoutes(fastify) {
    fastify.get("/api/characters", async () => {
        return prisma.character.findMany({
            orderBy: { priority: "desc" },
            include: {
                primaryShip: {
                    select: { slug: true, name: true },
                },
                primaryFaction: {
                    select: { slug: true, name: true },
                },
                tags: {
                    select: { id: true, name: true },
                },
            },
        });
    });
    fastify.get("/api/characters/slug/:slug", async (request, reply) => {
        const { slug } = request.params;
        const character = await prisma.character.findUnique({
            where: { slug },
            include: {
                primaryShip: {
                    select: { slug: true, name: true },
                },
                primaryFaction: {
                    select: { slug: true, name: true },
                },
                tags: {
                    select: { id: true, name: true },
                },
            },
        });
        if (!character) {
            reply.code(404);
            return { message: "Character not found" };
        }
        return character;
    });
}
